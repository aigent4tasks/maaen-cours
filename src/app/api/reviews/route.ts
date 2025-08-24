import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      )
    }

    const { courseId, rating, comment } = await request.json()

    // Check if user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: "يجب أن تكون مسجلاً في الدورة لتقييمها" },
        { status: 400 }
      )
    }

    // Check if user already reviewed the course
    const existingReview = await db.review.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    })

    if (existingReview) {
      // Update existing review
      const review = await db.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      })

      return NextResponse.json({
        message: "تم تحديث التقييم بنجاح",
        review,
      })
    } else {
      // Create new review
      const review = await db.review.create({
        data: {
          userId: session.user.id,
          courseId,
          rating,
          comment,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        }
      })

      return NextResponse.json({
        message: "تم إضافة التقييم بنجاح",
        review,
      })
    }
  } catch (error) {
    console.error("Review creation error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة التقييم" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const userId = searchParams.get("userId")

    const where: any = {}

    if (courseId) {
      where.courseId = courseId
    }

    if (userId) {
      where.userId = userId
    }

    const reviews = await db.review.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        course: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      reviews,
    })
  } catch (error) {
    console.error("Get reviews error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التقييمات" },
      { status: 500 }
    )
  }
}
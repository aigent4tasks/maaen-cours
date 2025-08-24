import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const course = await db.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true,
          }
        },
        lessons: {
          select: {
            id: true,
            title: true,
            content: true,
            videoUrl: true,
            duration: true,
            order: true,
            type: true,
            isPublished: true,
            isFree: true,
          },
          where: {
            isPublished: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              }
            }
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          }
        }
      },
    })

    if (!course) {
      return NextResponse.json(
        { error: "الدورة غير موجودة" },
        { status: 404 }
      )
    }

    // Calculate average rating
    const reviews = await db.review.findMany({
      where: { courseId: course.id },
      select: { rating: true },
    })

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    const totalDuration = course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)

    return NextResponse.json({
      course: {
        ...course,
        averageRating: Math.round(averageRating * 10) / 10,
        totalDuration,
        reviewCount: reviews.length,
      },
    })
  } catch (error) {
    console.error("Course details API error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب تفاصيل الدورة" },
      { status: 500 }
    )
  }
}
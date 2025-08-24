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

    const { title, content, courseId, lessonId } = await request.json()

    // Validate that either courseId or lessonId is provided
    if (!courseId && !lessonId) {
      return NextResponse.json(
        { error: "يجب تحديد دورة أو درس" },
        { status: 400 }
      )
    }

    // If lessonId is provided, check if user is enrolled in the course
    if (lessonId) {
      const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
        select: { courseId: true }
      })

      if (lesson) {
        const enrollment = await db.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: session.user.id,
              courseId: lesson.courseId,
            }
          }
        })

        if (!enrollment) {
          return NextResponse.json(
            { error: "يجب أن تكون مسجلاً في الدورة للمشاركة في النقاش" },
            { status: 400 }
          )
        }
      }
    }

    // If courseId is provided (without lessonId), check if user is enrolled
    if (courseId && !lessonId) {
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
          { error: "يجب أن تكون مسجلاً في الدورة للمشاركة في النقاش" },
          { status: 400 }
        )
      }
    }

    const discussion = await db.discussion.create({
      data: {
        title,
        content,
        userId: session.user.id,
        courseId: courseId || null,
        lessonId: lessonId || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        course: courseId ? {
          select: {
            id: true,
            title: true,
          }
        } : false,
        lesson: lessonId ? {
          select: {
            id: true,
            title: true,
          }
        } : false,
        replies: {
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
            createdAt: "asc",
          }
        }
      },
    })

    return NextResponse.json({
      message: "تم إنشاء النقاش بنجاح",
      discussion,
    })
  } catch (error) {
    console.error("Discussion creation error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء النقاش" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const lessonId = searchParams.get("lessonId")
    const userId = searchParams.get("userId")

    const where: any = {}

    if (courseId) {
      where.courseId = courseId
    }

    if (lessonId) {
      where.lessonId = lessonId
    }

    if (userId) {
      where.userId = userId
    }

    const discussions = await db.discussion.findMany({
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
        },
        lesson: {
          select: {
            id: true,
            title: true,
          }
        },
        replies: {
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
            createdAt: "asc",
          }
        },
        _count: {
          select: {
            replies: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      discussions,
    })
  } catch (error) {
    console.error("Get discussions error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب النقاشات" },
      { status: 500 }
    )
  }
}
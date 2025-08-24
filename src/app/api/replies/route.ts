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

    const { content, discussionId } = await request.json()

    // Get the discussion to check permissions
    const discussion = await db.discussion.findUnique({
      where: { id: discussionId },
      include: {
        course: {
          select: {
            id: true,
          }
        },
        lesson: {
          select: {
            id: true,
            courseId: true,
          }
        }
      }
    })

    if (!discussion) {
      return NextResponse.json(
        { error: "النقاش غير موجود" },
        { status: 404 }
      )
    }

    // Check if user is enrolled in the course
    const courseId = discussion.lesson?.courseId || discussion.courseId
    if (courseId) {
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

    const reply = await db.reply.create({
      data: {
        content,
        userId: session.user.id,
        discussionId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        discussion: {
          select: {
            id: true,
            title: true,
          }
        }
      },
    })

    return NextResponse.json({
      message: "تم إضافة الرد بنجاح",
      reply,
    })
  } catch (error) {
    console.error("Reply creation error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء إضافة الرد" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const discussionId = searchParams.get("discussionId")
    const userId = searchParams.get("userId")

    const where: any = {}

    if (discussionId) {
      where.discussionId = discussionId
    }

    if (userId) {
      where.userId = userId
    }

    const replies = await db.reply.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        discussion: {
          select: {
            id: true,
            title: true,
          }
        }
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json({
      replies,
    })
  } catch (error) {
    console.error("Get replies error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الردود" },
      { status: 500 }
    )
  }
}
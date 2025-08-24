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

    const { lessonId, enrollmentId, completed, watchTime } = await request.json()

    // Check if user is enrolled in the course
    const enrollment = await db.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          include: {
            lessons: {
              where: { id: lessonId },
            }
          }
        }
      }
    })

    if (!enrollment || enrollment.userId !== session.user.id) {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول إلى هذا الدرس" },
        { status: 403 }
      )
    }

    // Update or create progress record
    const progress = await db.progress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        }
      },
      update: {
        completed: completed || false,
        completedAt: completed ? new Date() : null,
        watchTime: watchTime || 0,
        enrollmentId,
      },
      create: {
        userId: session.user.id,
        lessonId,
        enrollmentId,
        completed: completed || false,
        completedAt: completed ? new Date() : null,
        watchTime: watchTime || 0,
      },
    })

    // Calculate overall enrollment progress
    const allLessons = await db.lesson.findMany({
      where: { courseId: enrollment.courseId },
    })

    const completedLessons = await db.progress.count({
      where: {
        userId: session.user.id,
        enrollmentId,
        completed: true,
      },
    })

    const progressPercentage = Math.round((completedLessons / allLessons.length) * 100)

    // Update enrollment progress
    await db.enrollment.update({
      where: { id: enrollmentId },
      data: {
        progress: progressPercentage,
        completedAt: progressPercentage === 100 ? new Date() : null,
        status: progressPercentage === 100 ? "COMPLETED" : "ACTIVE",
      },
    })

    return NextResponse.json({
      message: "تم تحديث التقدم بنجاح",
      progress: {
        ...progress,
        progressPercentage,
      },
    })
  } catch (error) {
    console.error("Progress update error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء تحديث التقدم" },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")
    const enrollmentId = searchParams.get("enrollmentId")

    const where: any = {
      userId: session.user.id,
    }

    if (courseId) {
      where.lesson = {
        courseId,
      }
    }

    if (enrollmentId) {
      where.enrollmentId = enrollmentId
    }

    const progress = await db.progress.findMany({
      where,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            duration: true,
            order: true,
            type: true,
            courseId: true,
          }
        },
        enrollment: {
          select: {
            id: true,
            courseId: true,
            progress: true,
          }
        }
      },
      orderBy: {
        lesson: {
          order: "asc",
        },
      },
    })

    return NextResponse.json({
      progress,
    })
  } catch (error) {
    console.error("Get progress error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التقدم" },
      { status: 500 }
    )
  }
}
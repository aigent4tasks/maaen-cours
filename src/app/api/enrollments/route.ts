import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { EnrollmentStatus } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      )
    }

    const { courseId } = await request.json()

    // Check if already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "أنت مسجل بالفعل في هذه الدورة" },
        { status: 400 }
      )
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: session.user.id,
        courseId,
        status: EnrollmentStatus.ACTIVE,
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: "تم الانضمام إلى الدورة بنجاح",
      enrollment,
    })
  } catch (error) {
    console.error("Enrollment error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء الانضمام إلى الدورة" },
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
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")

    const skip = (page - 1) * limit

    const where: any = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    const enrollments = await db.enrollment.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            level: true,
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
                duration: true,
                order: true,
              },
              where: {
                isPublished: true,
              },
              orderBy: {
                order: "asc",
              },
            },
            _count: {
              select: {
                lessons: true,
              }
            }
          }
        },
        lessonProgress: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                duration: true,
              }
            }
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        enrolledAt: "desc",
      },
    })

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = enrollments.map((enrollment) => {
      const totalLessons = enrollment.course.lessons.length
      const completedLessons = enrollment.lessonProgress.filter(
        (progress) => progress.completed
      ).length
      
      const progressPercentage = totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0

      return {
        ...enrollment,
        progressPercentage,
        completedLessons,
        totalLessons,
      }
    })

    const total = await db.enrollment.count({ where })

    return NextResponse.json({
      enrollments: enrollmentsWithProgress,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get enrollments error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب قائمة الدورات" },
      { status: 500 }
    )
  }
}
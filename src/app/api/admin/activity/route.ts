import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 403 }
      )
    }

    // Get recent users
    const recentUsers = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    // Get recent courses
    const recentCourses = await db.course.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        instructor: {
          select: {
            name: true,
          }
        }
      }
    })

    // Get recent enrollments
    const recentEnrollments = await db.enrollment.findMany({
      orderBy: { enrolledAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
          }
        },
        course: {
          select: {
            title: true,
          }
        }
      }
    })

    // Get recent reviews
    const recentReviews = await db.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        user: {
          select: {
            name: true,
          }
        },
        course: {
          select: {
            title: true,
          }
        }
      }
    })

    // Combine and format all activities
    const activities = [
      ...recentUsers.map(user => ({
        id: `user-${user.id}`,
        type: 'user' as const,
        title: 'مستخدم جديد',
        description: `${user.name} انضم إلى المنصة`,
        createdAt: user.createdAt,
      })),
      ...recentCourses.map(course => ({
        id: `course-${course.id}`,
        type: 'course' as const,
        title: 'دورة جديدة',
        description: `"${course.title}" بواسطة ${course.instructor.name}`,
        createdAt: course.createdAt,
      })),
      ...recentEnrollments.map(enrollment => ({
        id: `enrollment-${enrollment.id}`,
        type: 'enrollment' as const,
        title: 'تسجيل جديد',
        description: `${enrollment.user.name} سجل في "${enrollment.course.title}"`,
        createdAt: enrollment.enrolledAt,
      })),
      ...recentReviews.map(review => ({
        id: `review-${review.id}`,
        type: 'review' as const,
        title: 'تقييم جديد',
        description: `${review.user.name} قيم "${review.course.title}" بـ ${review.rating} نجوم`,
        createdAt: review.createdAt,
      })),
    ]

    // Sort by date and take the most recent 10
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({
      activity: activities.slice(0, 10),
    })
  } catch (error) {
    console.error("Admin activity error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب النشاط" },
      { status: 500 }
    )
  }
}
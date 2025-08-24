import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { CourseStatus } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const level = searchParams.get("level")
    const search = searchParams.get("search")

    const skip = (page - 1) * limit

    const where: any = {
      status: CourseStatus.PUBLISHED,
    }

    if (category) {
      where.category = {
        name: { contains: category, mode: "insensitive" }
      }
    }

    if (level) {
      where.level = level
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    const courses = await db.course.findMany({
      where,
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
            enrollments: true,
            reviews: true,
          }
        }
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    const total = await db.course.count({ where })

    // Calculate average rating for each course
    const coursesWithRating = await Promise.all(
      courses.map(async (course) => {
        const reviews = await db.review.findMany({
          where: { courseId: course.id },
          select: { rating: true },
        })

        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0

        const totalDuration = course.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0)

        return {
          ...course,
          averageRating: Math.round(averageRating * 10) / 10,
          totalDuration,
          reviewCount: reviews.length,
        }
      })
    )

    return NextResponse.json({
      courses: coursesWithRating,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Courses API error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الدورات" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      thumbnail,
      price,
      level,
      categoryId,
      instructorId,
    } = body

    // Create new course
    const course = await db.course.create({
      data: {
        title,
        description,
        thumbnail,
        price: price || 0,
        level,
        categoryId,
        instructorId,
        status: CourseStatus.DRAFT,
      },
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
      },
    })

    return NextResponse.json({
      message: "تم إنشاء الدورة بنجاح",
      course,
    })
  } catch (error) {
    console.error("Create course error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الدورة" },
      { status: 500 }
    )
  }
}
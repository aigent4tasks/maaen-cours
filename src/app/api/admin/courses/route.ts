import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { CourseStatus } from "@prisma/client"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const where: any = {}

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ]
    }

    if (status) {
      where.status = status
    }

    const courses = await db.course.findMany({
      where,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      courses,
    })
  } catch (error) {
    console.error("Admin courses error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب الدورات" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      price,
      level,
      status,
      instructorId,
      categoryId,
    } = body

    const course = await db.course.create({
      data: {
        title,
        description,
        price: price || 0,
        level,
        status: status || CourseStatus.DRAFT,
        instructorId,
        categoryId: categoryId || null,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
          }
        },
        category: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true,
          }
        }
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
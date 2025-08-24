import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({
      categories,
    })
  } catch (error) {
    console.error("Categories error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب التصنيفات" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, description, icon, color } = body

    const category = await db.category.create({
      data: {
        name,
        description,
        icon,
        color,
      },
    })

    return NextResponse.json({
      message: "تم إنشاء التصنيف بنجاح",
      category,
    })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء التصنيف" },
      { status: 500 }
    )
  }
}
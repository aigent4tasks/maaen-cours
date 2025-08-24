import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "غير مصرح لك بالوصول" },
        { status: 403 }
      )
    }

    const instructors = await db.user.findMany({
      where: {
        role: {
          in: [UserRole.INSTRUCTOR, UserRole.ADMIN]
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json({
      instructors,
    })
  } catch (error) {
    console.error("Admin instructors error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب المدربين" },
      { status: 500 }
    )
  }
}
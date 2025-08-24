import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({
        enrolled: false,
        message: "User not authenticated"
      })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json(
        { error: "Course ID is required" },
        { status: 400 }
      )
    }

    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId,
        }
      }
    })

    return NextResponse.json({
      enrolled: !!enrollment,
      enrollment: enrollment || null,
    })
  } catch (error) {
    console.error("Check enrollment error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء التحقق من التسجيل" },
      { status: 500 }
    )
  }
}
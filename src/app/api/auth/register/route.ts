import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { UserRole } from "@prisma/client"

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "المستخدم موجود بالفعل" },
        { status: 400 }
      )
    }

    // Create new user
    // In a real app, you would hash the password here
    // For demo purposes, we'll store it as plain text
    // In production, use: const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await db.user.create({
      data: {
        name,
        email,
        // password: hashedPassword, // In production
        role: UserRole.STUDENT,
      }
    })

    return NextResponse.json({
      message: "تم إنشاء الحساب بنجاح",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب" },
      { status: 500 }
    )
  }
}
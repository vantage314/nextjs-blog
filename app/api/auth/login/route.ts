import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { SignJWT } from 'jose'

// JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || "default-secret"  // 请改为强密码并配置到 .env 中

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    console.log("Login attempt for email:", email)

    // 验证用户是否存在
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.log("User not found:", email)
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      )
    }

    // 验证密码
    const isValidPassword = await compare(password, user.password)

    if (!isValidPassword) {
      console.log("Invalid password for user:", email)
      return NextResponse.json(
        { error: "密码错误" },
        { status: 401 }
      )
    }

    // 使用jose生成JWT token
    const jwt = await new SignJWT({ 
      userId: user.id,
      email: user.email 
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(JWT_SECRET))

    console.log("Token generated for user:", user.id)

    // 创建响应对象
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })

    // 设置token到cookie
    response.cookies.set("token", jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7天
    })

    console.log("Cookie set for user:", user.id)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    )
  }
} 
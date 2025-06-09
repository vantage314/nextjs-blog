import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkPasswordStrength } from "@/lib/utils/passwordStrength"
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || "default-secret"  // 请改为强密码并配置到 .env 中

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json()

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      )
    }

    // 校验密码强度
    const { strength, message } = checkPasswordStrength(password)
    if (strength === 'weak') {
      return NextResponse.json(
        { error: message },
        { status: 400 }
      )
    }

    // 加密密码
    const hashedPassword = await hash(password, 12)

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    // 创建 token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 创建响应对象
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token, // 可用于调试
    })

    // 设置 token 到 cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7天
    })

    return response
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "注册失败" },
      { status: 500 }
    )
  }
} 

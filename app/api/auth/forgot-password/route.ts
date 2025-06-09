import { NextResponse } from "next/server"
import { sign } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    // 验证用户是否存在
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      )
    }

    // 生成重置密码token
    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    )

    // 保存token到数据库
    await prisma.passwordReset.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600000), // 1小时后过期
      },
    })

    // 发送重置密码邮件
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`
    await sendEmail({
      to: email,
      subject: "重置密码",
      html: `
        <p>您好，</p>
        <p>请点击下面的链接重置您的密码：</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>此链接将在1小时后过期。</p>
        <p>如果您没有请求重置密码，请忽略此邮件。</p>
      `,
    })

    return NextResponse.json({
      message: "重置密码链接已发送到您的邮箱",
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json(
      { error: "发送重置密码链接失败" },
      { status: 500 }
    )
  }
} 
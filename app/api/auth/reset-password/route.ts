import { NextResponse } from "next/server"
import { verify } from "jsonwebtoken"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { checkPasswordStrength } from "@/lib/utils/passwordStrength"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    // 验证token
    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    // 查找重置密码记录
    const resetRecord = await prisma.passwordReset.findFirst({
      where: {
        userId: decoded.userId,
        token,
        expiresAt: {
          gt: new Date(),
        },
      },
    })

    if (!resetRecord) {
      return NextResponse.json(
        { error: "重置密码链接无效或已过期" },
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

    // 加密新密码
    const hashedPassword = await hash(password, 12)

    // 更新用户密码
    await prisma.user.update({
      where: { id: decoded.userId },
      data: { password: hashedPassword },
    })

    // 删除重置密码记录
    await prisma.passwordReset.delete({
      where: { id: resetRecord.id },
    })

    return NextResponse.json({
      message: "密码重置成功",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "重置密码失败" },
      { status: 500 }
    )
  }
} 
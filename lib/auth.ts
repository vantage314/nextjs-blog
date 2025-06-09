import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function getCurrentUser() {
  try {
    const token = cookies().get("token")?.value

    if (!token) {
      return null
    }

    const decoded = verify(token, process.env.JWT_SECRET || "your-secret-key") as { userId: string }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("未授权")
  }

  return user
}

export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
} 
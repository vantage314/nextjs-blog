import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from 'jose'

// 不需要认证的路径
const publicPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
]

// JWT 密钥
const JWT_SECRET = process.env.JWT_SECRET || "default-secret"  // 请改为强密码并配置到 .env 中

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  console.log("Middleware processing path:", pathname)

  // 检查是否是公开路径
  if (publicPaths.includes(pathname)) {
    console.log("Public path, skipping auth check:", pathname)
    return NextResponse.next()
  }

  // 获取token
  const token = request.cookies.get("token")?.value
  console.log("Token found:", !!token)

  // 如果没有token，重定向到登录页
  if (!token) {
    console.log("No token found, redirecting to login")
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  try {
    // 验证token
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    console.log("Token verified for user:", payload)
    return NextResponse.next()
  } catch (error) {
    // token无效，重定向到登录页
    console.error("Token verification failed:", error)
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }
}

// 配置需要进行中间件处理的路径
export const config = {
  matcher: [
    /*
     * 匹配所有路径除了：
     * 1. /api (API路由)
     * 2. /_next (Next.js内部路由)
     * 3. /static (静态文件)
     * 4. /favicon.ico, /sitemap.xml (静态文件)
     */
    "/((?!api|_next|static|favicon.ico|sitemap.xml).*)",
  ],
} 
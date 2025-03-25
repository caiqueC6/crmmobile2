import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the API key from the request header
  const apiKey = request.headers.get("x-api-key")

  // Check if the request is for the API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // If no API key is provided, return 401 Unauthorized
    if (!apiKey) {
      return NextResponse.json({ error: "API key is required" }, { status: 401 })
    }

    // Check if the API key is valid
    const validApiKey = process.env.API_KEY
    if (apiKey !== validApiKey) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/powercrm/:path*",
    "/api/quotations/:path*",
    "/api/whatsapp/:path*",
    "/api/sync/:path*",
    "/api/dashboard/:path*",
    "/api/messages/:path*",
  ],
}


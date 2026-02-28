import { revalidatePath } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

import i18nConfig from "../../../i18n.config.json"

// Simple rate limiting - track requests by IP
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW_MS = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10

function getRateLimitKey(req: NextRequest): string {
  // Use forwarded IP if available (for proxied requests), otherwise use direct IP
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown"
  )
}

function checkRateLimit(key: string): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(key)

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    })
    return true
  }

  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  userLimit.count++
  return true
}

export async function GET(req: NextRequest) {
  const rateLimitKey = getRateLimitKey(req)

  // Check rate limit
  if (!checkRateLimit(rateLimitKey)) {
    console.warn(`Rate limit exceeded for IP: ${rateLimitKey}`)
    return NextResponse.json(
      { message: "Too many requests. Please try again later." },
      { status: 429 }
    )
  }

  const searchParams = req.nextUrl.searchParams
  const secret = searchParams.get("secret")

  // Validate secret (timing-safe comparison would be better in production)
  if (!process.env.REVALIDATE_SECRET) {
    console.error("REVALIDATE_SECRET environment variable is not set")
    return NextResponse.json(
      { message: "Service misconfigured" },
      { status: 500 }
    )
  }

  if (secret !== process.env.REVALIDATE_SECRET) {
    console.warn(
      `Invalid revalidation secret attempt from IP: ${rateLimitKey}`
    )
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 })
  }

  const BUILD_LOCALES = process.env.NEXT_PUBLIC_BUILD_LOCALES
  // Supported locales defined in `i18n.config.json`
  const locales = BUILD_LOCALES
    ? BUILD_LOCALES.split(",")
    : i18nConfig.map(({ code }) => code)

  const path = searchParams.get("path")
  console.log("Revalidating", path)

  try {
    if (!path) {
      return NextResponse.json({ message: "No path provided" }, { status: 400 })
    }

    const hasLocaleInPath = locales.some((locale) =>
      path.startsWith(`/${locale}/`)
    )

    if (hasLocaleInPath) {
      revalidatePath(path)
    } else {
      // First revalidate the default locale to cache the results
      revalidatePath(`/en${path}`)

      // Then revalidate all other locales
      await Promise.all(
        locales.map(async (locale) => {
          const localePath = `/${locale}${path}`
          console.log(`Revalidating ${localePath}`)
          try {
            revalidatePath(localePath)
          } catch (err) {
            console.error(`Error revalidating ${localePath}`, err)
            throw new Error(`Error revalidating ${localePath}`)
          }
        })
      )
    }

    return NextResponse.json({ revalidated: true })
  } catch (err) {
    console.error(err)
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 })
  }
}

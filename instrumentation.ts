import * as Sentry from "@sentry/nextjs"

import { validateAndLogEnv } from "@/lib/utils/validateEnv"

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Validate environment variables on server startup
    try {
      validateAndLogEnv()
    } catch (error) {
      console.error("Environment validation failed:", error)
      // In production, this will prevent the server from starting
      if (process.env.NODE_ENV === "production") {
        process.exit(1)
      }
    }

    await import("./sentry.server.config")
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config")
  }
}

export const onRequestError = Sentry.captureRequestError

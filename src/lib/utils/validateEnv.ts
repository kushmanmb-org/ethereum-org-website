/**
 * Environment Variable Validation Utility
 * 
 * This utility validates that required environment variables are present
 * and properly configured for blockchain security.
 */

interface EnvValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validates environment variables for security best practices
 * @returns Validation result with errors and warnings
 */
export function validateEnvironmentVariables(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check for sensitive variables with NEXT_PUBLIC_ prefix (security risk)
  const publicPrefixVars = Object.keys(process.env).filter((key) =>
    key.startsWith("NEXT_PUBLIC_")
  )

  const sensitivePatterns = [
    /SECRET/i,
    /PRIVATE/i,
    /PASSWORD/i,
    /CREDENTIAL/i,
    /AWS.*KEY/i,
    /SES.*KEY/i,
  ]

  publicPrefixVars.forEach((varName) => {
    sensitivePatterns.forEach((pattern) => {
      if (pattern.test(varName)) {
        errors.push(
          `Security Risk: ${varName} uses NEXT_PUBLIC_ prefix but appears to contain sensitive data. ` +
            `NEXT_PUBLIC_ variables are exposed to the browser. Remove the prefix or use a different variable name.`
        )
      }
    })
  })

  // Check for required blockchain configuration
  if (process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID === undefined) {
    warnings.push(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. Wallet connectivity may not work properly."
    )
  }

  // Validate WalletConnect Project ID format (if present)
  if (
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID &&
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID.length < 32
  ) {
    warnings.push(
      "NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID appears to be invalid. It should be a 32+ character string."
    )
  }

  // Check Alchemy API Key (if using it)
  if (
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY &&
    process.env.NEXT_PUBLIC_ALCHEMY_API_KEY.length < 32
  ) {
    warnings.push(
      "NEXT_PUBLIC_ALCHEMY_API_KEY appears to be invalid. It should be a 32+ character string."
    )
  }

  // Validate AWS SES configuration (server-side only)
  const sesConfigured =
    process.env.SES_ACCESS_KEY_ID &&
    process.env.SES_SECRET_ACCESS_KEY &&
    process.env.SES_REGION

  if (
    (process.env.SES_ACCESS_KEY_ID ||
      process.env.SES_SECRET_ACCESS_KEY ||
      process.env.SES_REGION) &&
    !sesConfigured
  ) {
    errors.push(
      "Incomplete AWS SES configuration. All three variables required: SES_ACCESS_KEY_ID, SES_SECRET_ACCESS_KEY, SES_REGION"
    )
  }

  // Validate SES Access Key format
  if (
    process.env.SES_ACCESS_KEY_ID &&
    !/^AKIA[0-9A-Z]{16}$/.test(process.env.SES_ACCESS_KEY_ID)
  ) {
    errors.push(
      "SES_ACCESS_KEY_ID has invalid format. AWS access keys should start with 'AKIA' followed by 16 alphanumeric characters."
    )
  }

  // Check for revalidation secret in production
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.REVALIDATE_SECRET
  ) {
    warnings.push(
      "REVALIDATE_SECRET is not set in production. The revalidation API endpoint will not be accessible."
    )
  }

  // Validate that mock data is not enabled in production
  if (
    process.env.NODE_ENV === "production" &&
    process.env.USE_MOCK_DATA === "true"
  ) {
    errors.push(
      "USE_MOCK_DATA should not be enabled in production. Set USE_MOCK_DATA=false or remove it."
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Validates and logs environment variable issues
 * Use during application startup to catch configuration problems early
 */
export function validateAndLogEnv(): void {
  // Skip validation during build time
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return
  }

  const result = validateEnvironmentVariables()

  if (result.errors.length > 0) {
    console.error("❌ Environment Variable Validation Errors:")
    result.errors.forEach((error) => {
      console.error(`  - ${error}`)
    })

    // In production, this should stop the application
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Environment validation failed. Check logs for details."
      )
    }
  }

  if (result.warnings.length > 0) {
    console.warn("⚠️  Environment Variable Warnings:")
    result.warnings.forEach((warning) => {
      console.warn(`  - ${warning}`)
    })
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log("✅ Environment variables validated successfully")
  }
}

/**
 * Sanitize environment variable for logging
 * Masks sensitive parts while keeping enough info for debugging
 */
export function sanitizeEnvForLogging(value: string | undefined): string {
  if (!value) return "[not set]"

  // For very short values, mask completely
  if (value.length <= 8) {
    return "****"
  }

  // Show first 4 and last 4 characters, mask the middle
  const visible = 4
  const start = value.substring(0, visible)
  const end = value.substring(value.length - visible)
  const maskedLength = Math.max(4, value.length - visible * 2)

  return `${start}${"*".repeat(maskedLength)}${end}`
}

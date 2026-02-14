import type { MetricReturnData } from "@/lib/types"

/**
 * Generic configuration for fetching metrics from external APIs
 */
export type FetchMetricConfig<TResponse = unknown, TValue = number> = {
  /** The URL to fetch from */
  url: string
  /** A descriptive name for the metric (used in error messages) */
  metricName: string
  /** Optional fetch configuration */
  fetchOptions?: RequestInit
  /** Function to extract the value from the API response */
  extractValue: (response: TResponse) => TValue
  /** Optional function to validate the extracted value */
  validateValue?: (value: TValue) => boolean
  /** Optional custom error message */
  errorMessage?: string
}

/**
 * Generic utility function to fetch metrics from external APIs
 * with consistent error handling and return structure.
 *
 * @param config - Configuration object for fetching the metric
 * @returns Promise<MetricReturnData> - The metric value with timestamp or an error
 *
 * @example
 * // Simple usage for fetching ETH price
 * const config: FetchMetricConfig<{ ethereum: { usd: number } }> = {
 *   url: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
 *   metricName: "ETH price",
 *   extractValue: (data) => data.ethereum.usd,
 *   validateValue: (usd) => usd > 0,
 * }
 * const result = await fetchMetric(config)
 */
export async function fetchMetric<TResponse = unknown, TValue = number>(
  config: FetchMetricConfig<TResponse, TValue>
): Promise<MetricReturnData> {
  const {
    url,
    metricName,
    fetchOptions = {},
    extractValue,
    validateValue,
    errorMessage,
  } = config

  try {
    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
      console.log(response.status, response.statusText)
      throw new Error(
        errorMessage || `Failed to fetch ${metricName} from ${url}`
      )
    }

    const data: TResponse = await response.json()
    const value = extractValue(data)

    // Validate the extracted value if validator is provided
    if (validateValue && !validateValue(value as TValue)) {
      throw new Error(`Invalid ${metricName} value received`)
    }

    // For numeric values, return with timestamp
    if (typeof value === "number") {
      return { value, timestamp: Date.now() }
    }

    // For other types, return with timestamp
    return { value: value as number, timestamp: Date.now() }
  } catch (error) {
    console.error(`Error fetching ${metricName}:`, error)
    return {
      error:
        error instanceof Error
          ? error.message
          : `Unable to fetch ${metricName}`,
    }
  }
}

/**
 * Simple wrapper for fetching metrics that only need a URL and value extractor
 */
export async function fetchSimpleMetric<TResponse>(
  url: string,
  metricName: string,
  extractValue: (response: TResponse) => number
): Promise<MetricReturnData> {
  return fetchMetric({
    url,
    metricName,
    extractValue,
  })
}

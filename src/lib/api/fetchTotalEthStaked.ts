import type { EthStakedResponse, MetricReturnData } from "@/lib/types"

import { DUNE_API_URL } from "../constants"

import { fetchMetric } from "./fetchMetricUtils"

const DUNE_API_KEY = process.env.DUNE_API_KEY

export const fetchTotalEthStaked = async (): Promise<MetricReturnData> => {
  if (!DUNE_API_KEY) {
    console.error("Dune API key not found")
    return { error: "Dune API key not found" }
  }

  const url = new URL("api/v1/query/3915587/results", DUNE_API_URL)

  return fetchMetric<EthStakedResponse>({
    url: url.href,
    metricName: "ETH staked data",
    fetchOptions: {
      headers: { "X-Dune-API-Key": DUNE_API_KEY },
    },
    extractValue: (json) => {
      const {
        result: { rows = [] },
      } = json
      // Today's value at start of array
      return rows[0].cum_deposited_eth
    },
    errorMessage: "Failed to fetch eth staked data",
  })
}

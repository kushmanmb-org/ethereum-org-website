import { DefiLlamaTVLResponse, MetricReturnData } from "@/lib/types"

import { fetchMetric } from "./fetchMetricUtils"

export const fetchTotalValueLocked = async (): Promise<MetricReturnData> => {
  return fetchMetric<DefiLlamaTVLResponse>({
    url: "https://api.llama.fi/charts/Ethereum",
    metricName: "DeFi Llama TVL",
    extractValue: (json) => {
      // Today's value at end of array
      return json[json.length - 1].totalLiquidityUSD
    },
    errorMessage: "Failed to fetch Defi Llama TVL data",
  })
}

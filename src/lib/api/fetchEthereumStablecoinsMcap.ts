import { MetricReturnData } from "../types"

import { fetchMetric } from "./fetchMetricUtils"

export type LlamaStablecoinchainsResponseItem = {
  gecko_id: string | null
  totalCirculatingUSD: Record<string, number>
  tokenSymbol: string | null
  name: string
}

export async function fetchEthereumStablecoinsMcap(): Promise<MetricReturnData> {
  return fetchMetric<LlamaStablecoinchainsResponseItem[]>({
    url: "https://stablecoins.llama.fi/stablecoinchains",
    metricName: "Ethereum stablecoins market cap",
    extractValue: (data) => {
      const ethereumData = data.find(({ gecko_id }) => gecko_id === "ethereum")
      if (!ethereumData) throw new Error("Ethereum stablecoin data not found")

      return Object.values(ethereumData.totalCirculatingUSD).reduce(
        (acc, value) => acc + value,
        0
      )
    },
    errorMessage:
      "Something went wrong with requesting the Ethereum stablecoins data.",
  })
}

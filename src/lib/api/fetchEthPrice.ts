import type { MetricReturnData } from "../types"

import { fetchMetric } from "./fetchMetricUtils"

type CoinGeckoResponse = { ethereum: { usd: number } }

export const fetchEthPrice = async (): Promise<MetricReturnData> => {
  return fetchMetric<CoinGeckoResponse>({
    url: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    metricName: "ETH price",
    extractValue: (data) => data.ethereum.usd,
    validateValue: (usd) => Boolean(usd),
    errorMessage: "Unable to fetch ETH price from CoinGecko",
  })
}

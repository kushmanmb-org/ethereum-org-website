import type { MetricReturnData } from "../types"

import { fetchMetric } from "./fetchMetricUtils"

type CoinGeckoMarketCapResponse = { ethereum: { usd_market_cap: number } }

export const fetchEthereumMarketcap = async (): Promise<MetricReturnData> => {
  return fetchMetric<CoinGeckoMarketCapResponse>({
    url: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd&include_market_cap=true",
    metricName: "ETH market cap",
    extractValue: (data) => data.ethereum.usd_market_cap,
    validateValue: (value) => Boolean(value),
    errorMessage: "Unable to fetch ETH market cap from CoinGecko",
  })
}

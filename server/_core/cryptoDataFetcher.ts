/**
 * Crypto Data Fetcher
 * Fetches real-time cryptocurrency market data from reliable APIs
 */

export interface CryptoMarketData {
  btcPrice: number;
  btcPriceChange24h: number;
  totalMarketCap: number;
  btcDominance: number;
  ethPrice: number;
  ethPriceChange24h: number;
  topMovers: Array<{ symbol: string; change: number }>;
  timestamp: string;
}

export interface GoMiningData {
  tokenPrice: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  lastUpdate: string;
}

/**
 * Fetch real-time Bitcoin and market data from CoinGecko API
 */
export async function fetchCryptoMarketData(): Promise<CryptoMarketData> {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/global?vs_currency=usd",
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await response.json();

    const btcResponse = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_market_cap=true",
      { signal: AbortSignal.timeout(5000) }
    );
    const btcData = await btcResponse.json();

    return {
      btcPrice: btcData.bitcoin?.usd || 68500,
      btcPriceChange24h: btcData.bitcoin?.usd_24h_change || 0,
      totalMarketCap: data.data?.total_market_cap?.usd || 2500000000000,
      btcDominance: data.data?.market_cap_percentage?.btc || 53.5,
      ethPrice: btcData.ethereum?.usd || 3500,
      ethPriceChange24h: btcData.ethereum?.usd_24h_change || 0,
      topMovers: [],
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("Using fallback market data due to API error:", error);
    return {
      btcPrice: 68500,
      btcPriceChange24h: 1.2,
      totalMarketCap: 2500000000000,
      btcDominance: 53.5,
      ethPrice: 3500,
      ethPriceChange24h: 0.8,
      topMovers: [],
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Fetch GoMining token data from CoinGecko API
 */
export async function fetchGoMiningData(): Promise<GoMiningData> {
  try {
    // Use the correct ID: gmt-token
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=gmt-token&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true",
      { signal: AbortSignal.timeout(5000) }
    );
    const data = await response.json();

    // CoinGecko returns keys exactly as the IDs passed
    const tokenData = data["gmt-token"];
    
    if (tokenData) {
      return {
        tokenPrice: tokenData.usd || 0.30,
        marketCap: tokenData.usd_market_cap || 122000000,
        volume24h: tokenData.usd_24h_vol || 5000000,
        holders: 0,
        lastUpdate: new Date().toISOString(),
      };
    }
    
    throw new Error(`Token 'gmt-token' not found in response: ${JSON.stringify(data)}`);
  } catch (error) {
    console.warn("Using fallback GoMining data due to API error:", error);
    return {
      tokenPrice: 0.30,
      marketCap: 122000000,
      volume24h: 5000000,
      holders: 0,
      lastUpdate: new Date().toISOString(),
    };
  }
}

/**
 * Format market data for display in blog posts
 */
export function formatMarketData(data: CryptoMarketData): string {
  const marketCapInTrillions = (data.totalMarketCap / 1_000_000_000_000).toFixed(2);
  const btcPriceFormatted = data.btcPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return `
| Metric | Current Status |
| :--- | :--- |
| Bitcoin (BTC) Price | ${btcPriceFormatted} |
| 24h Change | ${data.btcPriceChange24h.toFixed(2)}% |
| Total Crypto Market Cap | $${marketCapInTrillions} Trillion |
| BTC Dominance | ${data.btcDominance.toFixed(1)}% |
| Ethereum (ETH) Price | $${data.ethPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} |
| ETH 24h Change | ${data.ethPriceChange24h.toFixed(2)}% |
`;
}

/**
 * Format GoMining data for display in blog posts
 */
export function formatGoMiningData(data: GoMiningData): string {
  const marketCapInMillions = (data.marketCap / 1_000_000).toFixed(1);

  return `
| Metric | Current Status |
| :--- | :--- |
| GOMINING Token Price | $${data.tokenPrice.toFixed(4)} |
| Market Cap | $${marketCapInMillions} Million |
| 24h Volume | $${(data.volume24h / 1_000_000).toFixed(2)} Million |
`;
}

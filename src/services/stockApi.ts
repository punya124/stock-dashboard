import type { FinnhubQuoteResponse, StockQuote } from '../types/stock';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY as string;
const BASE_URL = 'https://finnhub.io/api/v1';

// Map of symbol → display name
export const TRACKED_STOCKS: Record<string, string> = {
  AAPL:  'Apple Inc.',
  MSFT:  'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
  AMZN:  'Amazon.com Inc.',
  TSLA:  'Tesla Inc.',
  NVDA:  'NVIDIA Corp.',
  META:  'Meta Platforms',
  NFLX:  'Netflix Inc.',
  AMD:   'Advanced Micro Devices',
  INTC:  'Intel Corp.',
};

export async function fetchQuote(symbol: string): Promise<FinnhubQuoteResponse> {
  const url = `${BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${symbol}`);
  return res.json();
}

export async function fetchAllQuotes(): Promise<StockQuote[]> {
  const symbols = Object.keys(TRACKED_STOCKS);

  const results = await Promise.allSettled(
    symbols.map(async (sym) => {
      const q = await fetchQuote(sym);
      const stock: StockQuote = {
        symbol: sym,
        name: TRACKED_STOCKS[sym],
        currentPrice: q.c,
        change: q.d,
        percentChange: q.dp,
        highPrice: q.h,
        lowPrice: q.l,
        openPrice: q.o,
        previousClose: q.pc,
        timestamp: q.t,
      };
      return stock;
    })
  );

  return results
    .filter((r): r is PromiseFulfilledResult<StockQuote> => r.status === 'fulfilled')
    .map((r) => r.value);
}

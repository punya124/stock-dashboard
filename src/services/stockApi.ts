import type { FinnhubQuoteResponse, StockQuote } from '../types/stock';

const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY as string;
const BASE_URL = 'https://finnhub.io/api/v1';

// Map of symbol → display name
export const TRACKED_STOCKS: Record<string, string> = {
  AAPL: 'Apple Inc.',
  MSFT: 'Microsoft Corp.',
  GOOGL: 'Alphabet Inc.',
  AMZN: 'Amazon.com Inc.',
  TSLA: 'Tesla Inc.',
  NVDA: 'NVIDIA Corp.',
  META: 'Meta Platforms',
  NFLX: 'Netflix Inc.',
  AMD: 'Advanced Micro Devices',
  INTC: 'Intel Corp.',
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

export function fetchCandles(symbol: string): Promise<import('../types/stock').CandleData[]> {
  const seedPrices: Record<string, number> = {
    AAPL: 169, MSFT: 378, GOOGL: 141, AMZN: 178, TSLA: 202,
    NVDA: 485, META: 490, NFLX: 605, AMD: 168, INTC: 43,
  };

  const seed = seedPrices[symbol] ?? 100;
  const candles: import('../types/stock').CandleData[] = [];

  const now = new Date();
  let price = seed;

  for (let i = 90; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    const change = price * (Math.random() * 0.04 - 0.018);
    const open = price;
    const close = Math.max(open + change, 1);
    const high = Math.max(open, close) * (1 + Math.random() * 0.015);
    const low = Math.min(open, close) * (1 - Math.random() * 0.015);

    candles.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      timestamp: date.getTime(),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 80_000_000 + 20_000_000),
    });

    price = close;
  }

  return Promise.resolve(candles);
}
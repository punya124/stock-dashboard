export interface StockQuote {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClose: number;
  timestamp: number;
}

export interface FinnhubQuoteResponse {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;  // high
  l: number;  // low
  o: number;  // open
  pc: number; // previous close
  t: number;  // timestamp
}

export type SortKey = 'symbol' | 'currentPrice' | 'change' | 'percentChange';
export type SortDir = 'asc' | 'desc';

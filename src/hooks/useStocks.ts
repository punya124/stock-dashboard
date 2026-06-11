import { useState, useEffect, useCallback } from 'react';
import type { StockQuote } from '../types/stock';
import { fetchAllQuotes } from '../services/stockApi';

interface UseStocksReturn {
  stocks: StockQuote[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useStocks(): UseStocksReturn {
  const [stocks, setStocks]         = useState<StockQuote[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllQuotes();
      setStocks(data);
      setLastUpdated(new Date());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch stock data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh every 60 seconds
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [load]);

  return { stocks, loading, error, lastUpdated, refresh: load };
}

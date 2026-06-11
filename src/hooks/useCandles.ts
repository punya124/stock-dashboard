/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import type { CandleData } from '../types/stock';
import { fetchCandles } from '../services/stockApi';

interface UseCandles {
  candles: CandleData[];
  loading: boolean;
  error: string | null;
}

// Simple cache so re-expanding doesn't refetch
const cache: Record<string, CandleData[]> = {};

export function useCandles(symbol: string | null): UseCandles {
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!symbol) return;

    if (cache[symbol]) {
      setCandles(cache[symbol]);
      return;
    }

    setLoading(true);
    setError(null);
    setCandles([]);

    fetchCandles(symbol)
      .then(data => {
        cache[symbol] = data;
        setCandles(data);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load chart'))
      .finally(() => setLoading(false));
  }, [symbol]);

  return { candles, loading, error };
}

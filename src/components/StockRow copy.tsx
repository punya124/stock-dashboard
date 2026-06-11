import React, { useState, lazy, Suspense } from 'react';
import type { StockQuote } from '../types/stock';
import { formatPrice, formatChange, formatPercent, getChangeClass, getRowClass, getBadgeClass, getArrow } from '../utils/format';
import { useCandles } from '../hooks/useCandles';

const CandlestickChart = lazy(() => import('./CandlestickChart'));

interface StockRowProps {
  stock: StockQuote;
  rank: number;
}

const ChartPanel: React.FC<{ symbol: string }> = ({ symbol }) => {
  const { candles, loading, error } = useCandles(symbol);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-6 h-6 text-blue-400 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="text-xs text-slate-400 font-medium">Loading chart…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-600 mb-1">Chart unavailable</p>
          <p className="text-xs text-slate-400 max-w-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (!candles.length) return null;

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[300px]">
        <span className="text-xs text-slate-400">Rendering chart…</span>
      </div>
    }>
      <CandlestickChart data={candles} symbol={symbol} />
    </Suspense>
  );
};

const StockRow: React.FC<StockRowProps> = ({ stock, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const changeClass = getChangeClass(stock.percentChange);
  const rowClass = getRowClass(stock.percentChange);
  const badgeClass = getBadgeClass(stock.percentChange);
  const arrow = getArrow(stock.percentChange);

  const avatarColors = [
    'bg-blue-100 text-blue-700',
    'bg-violet-100 text-violet-700',
    'bg-amber-100 text-amber-700',
    'bg-emerald-100 text-emerald-700',
    'bg-rose-100 text-rose-700',
    'bg-cyan-100 text-cyan-700',
    'bg-orange-100 text-orange-700',
    'bg-pink-100 text-pink-700',
  ];
  const avatarClass = avatarColors[(rank - 1) % avatarColors.length];

  return (
    <>
      <tr
        className={`border-b border-slate-100 table-row-hover ${rowClass} ${expanded ? 'bg-blue-50/40' : ''}`}
        onClick={() => setExpanded(e => !e)}
      >
        {/* Symbol + Name */}
        <td className="px-6 py-4 w-[240px]">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarClass}`}>
              {stock.symbol.slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 font-mono leading-snug">{stock.symbol}</p>
              <p className="text-xs text-slate-400 truncate">{stock.name}</p>
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="px-6 py-4 text-right">
          <span className={`text-sm tabular-nums font-semibold font-mono ${stock.currentPrice > stock.previousClose ? 'text-emerald-700' : stock.currentPrice < stock.previousClose ? 'text-red-600' : 'text-slate-700'}`}>
            {formatPrice(stock.currentPrice)}
          </span>
        </td>

        {/* Change $ */}
        <td className="px-6 py-4 text-right">
          <span className={`text-sm tabular-nums ${changeClass}`}>
            {formatChange(stock.change)}
          </span>
        </td>

        {/* Change % badge */}
        <td className="px-6 py-4">
          <div className="flex justify-end">
            <span className={badgeClass}>
              {arrow} {formatPercent(Math.abs(stock.percentChange)).replace('+', '').replace('-', '')}
            </span>
          </div>
        </td>

        {/* High */}
        <td className="px-6 py-4 text-right hidden lg:table-cell">
          <span className="text-xs text-slate-500 font-mono tabular-nums">{formatPrice(stock.highPrice)}</span>
        </td>

        {/* Low */}
        <td className="px-6 py-4 text-right hidden lg:table-cell">
          <span className="text-xs text-slate-500 font-mono tabular-nums">{formatPrice(stock.lowPrice)}</span>
        </td>

        {/* Prev Close */}
        <td className="px-6 py-4 text-right hidden xl:table-cell">
          <span className="text-xs text-slate-500 font-mono tabular-nums">{formatPrice(stock.previousClose)}</span>
        </td>

        {/* Expand chevron */}
        <td className="px-4 py-4 text-right">
          <svg
            className={`w-4 h-4 text-slate-300 transition-transform duration-200 inline-block ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 16 16" fill="none"
          >
            <path d="M4 6 L8 10 L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </td>
      </tr>

      {/* Expanded chart row */}
      {expanded && (
        <tr className="bg-white border-b border-slate-200 animate-fade-in">
          <td colSpan={8} className="px-8 py-6">
            <ChartPanel symbol={stock.symbol} />
          </td>
        </tr>
      )}
    </>
  );
};

export default StockRow;

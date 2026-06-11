import React from 'react';
import type { StockQuote } from '../types/stock';
import { formatPrice, formatPercent } from '../utils/format';

interface SummaryCardsProps {
  stocks: StockQuote[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ stocks }) => {
  const gainers = stocks.filter(s => s.percentChange > 0);
  const losers  = stocks.filter(s => s.percentChange < 0);

  const topGainer = [...stocks].sort((a, b) => b.percentChange - a.percentChange)[0];
  const topLoser  = [...stocks].sort((a, b) => a.percentChange - b.percentChange)[0];

  const avgChange = stocks.length
    ? stocks.reduce((sum, s) => sum + s.percentChange, 0) / stocks.length
    : 0;

  const marketSentiment = avgChange > 0.5 ? 'Bullish' : avgChange < -0.5 ? 'Bearish' : 'Neutral';
  const sentimentColor  = avgChange > 0.5
    ? 'text-emerald-600' : avgChange < -0.5
    ? 'text-red-500' : 'text-slate-500';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
      {/* Total Tracked */}
      <div className="stat-card">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-4.5 h-4.5 text-blue-600" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="1" y="9" width="4" height="8" rx="1" fill="currentColor" opacity="0.4"/>
              <rect x="7" y="5" width="4" height="12" rx="1" fill="currentColor" opacity="0.7"/>
              <rect x="13" y="1" width="4" height="16" rx="1" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Tracked</span>
        </div>
        <p className="text-3xl font-bold text-slate-900 tabular-nums">{stocks.length}</p>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          {gainers.length} up · {losers.length} down
        </p>
      </div>

      {/* Top Gainer */}
      <div className="stat-card border-l-2 border-l-emerald-400">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 16 16" fill="none">
              <path d="M8 3 L8 13 M3 7 L8 2 L13 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Top Gainer</span>
        </div>
        {topGainer ? (
          <>
            <p className="text-2xl font-bold text-slate-900 tabular-nums font-mono">{topGainer.symbol}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-mono text-slate-600">{formatPrice(topGainer.currentPrice)}</span>
              <span className="badge-positive">▲ {formatPercent(topGainer.percentChange)}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">—</p>
        )}
      </div>

      {/* Top Loser */}
      <div className="stat-card border-l-2 border-l-red-400">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-red-500" viewBox="0 0 16 16" fill="none">
              <path d="M8 13 L8 3 M3 9 L8 14 L13 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Top Loser</span>
        </div>
        {topLoser ? (
          <>
            <p className="text-2xl font-bold text-slate-900 tabular-nums font-mono">{topLoser.symbol}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-sm font-mono text-slate-600">{formatPrice(topLoser.currentPrice)}</span>
              <span className="badge-negative">▼ {formatPercent(Math.abs(topLoser.percentChange))}</span>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">—</p>
        )}
      </div>

      {/* Market Sentiment */}
      <div className="stat-card">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
            <svg className="w-4 h-4 text-slate-600" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M5 9.5 C5.5 11 7 12 8 12 C9 12 10.5 11 11 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="5.5" cy="6.5" r="1" fill="currentColor"/>
              <circle cx="10.5" cy="6.5" r="1" fill="currentColor"/>
            </svg>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Sentiment</span>
        </div>
        <p className={`text-2xl font-bold ${sentimentColor}`}>{marketSentiment}</p>
        <p className="text-xs text-slate-500 mt-1 font-mono">
          Avg {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;

import React, { useState } from 'react';
import type { StockQuote } from '../types/stock';
import { formatPrice, formatChange, formatPercent, getChangeClass, getRowClass, getBadgeClass, getArrow } from '../utils/format';

interface StockRowProps {
  stock: StockQuote;
  rank: number;
}

const StockRow: React.FC<StockRowProps> = ({ stock, rank }) => {
  const [expanded, setExpanded] = useState(false);

  const changeClass = getChangeClass(stock.percentChange);
  const rowClass = getRowClass(stock.percentChange);
  const badgeClass = getBadgeClass(stock.percentChange);
  const arrow = getArrow(stock.percentChange);

  // Initials avatar color based on symbol
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
        <td className="px-6 py-4 row-indicator ${rowClass}">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarClass}`}>
              {stock.symbol.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 font-mono">{stock.symbol}</p>
              <p className="text-xs text-slate-400 truncate max-w-[140px]">{stock.name}</p>
            </div>
          </div>
        </td>

        {/* Price */}
        <td className="px-6 py-4 text-right">
          <span className={`text-sm tabular-nums font-semibold ${stock.currentPrice > stock.previousClose ? 'text-emerald-700' : stock.currentPrice < stock.previousClose ? 'text-red-600' : 'text-slate-700'} font-mono`}>
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
        <td className="px-6 py-4 text-right">
          <span className={badgeClass}>
            {arrow} {formatPercent(Math.abs(stock.percentChange)).replace('+', '').replace('-', '')}
          </span>
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

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-blue-50/30 border-b border-slate-100 animate-fade-in">
          <td colSpan={8} className="px-6 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              {[
                { label: 'Open', value: formatPrice(stock.openPrice) },
                { label: 'Prev Close', value: formatPrice(stock.previousClose) },
                { label: "Day's High", value: formatPrice(stock.highPrice) },
                { label: "Day's Low", value: formatPrice(stock.lowPrice) },
              ].map(item => (
                <div key={item.label} className="bg-white rounded-lg px-3 py-2.5 border border-slate-200">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">{item.label}</p>
                  <p className="text-sm font-mono font-semibold text-slate-800 tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default StockRow;

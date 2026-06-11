import React, { useState } from 'react';
import type { StockQuote, SortKey, SortDir } from '../types/stock';
import StockRow from './StockRow';
import Loader from './Loader';

interface StockTableProps {
  stocks: StockQuote[];
  loading: boolean;
}

const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => (
  <svg
    className={`w-3 h-3 inline-block ml-1 transition-opacity ${active ? 'opacity-100' : 'opacity-30'}`}
    viewBox="0 0 10 12" fill="none"
  >
    <path
      d="M5 1 L5 11 M2 4 L5 1 L8 4"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={active && dir === 'asc' ? 'text-blue-600' : 'text-slate-400'}
    />
    <path
      d="M2 8 L5 11 L8 8"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      className={active && dir === 'desc' ? 'text-blue-600' : 'text-slate-400'}
    />
  </svg>
);

const StockTable: React.FC<StockTableProps> = ({ stocks, loading }) => {
  const [sortKey, setSortKey] = useState<SortKey>('percentChange');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sorted = [...stocks].sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'symbol') return mul * a.symbol.localeCompare(b.symbol);
    return mul * (a[sortKey] - b[sortKey]);
  });

  const thClass = (key: SortKey) => `
    px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider cursor-pointer
    select-none whitespace-nowrap
    ${sortKey === key ? 'text-blue-600' : 'text-slate-400'}
    hover:text-slate-600 transition-colors duration-150
  `;

  if (!loading && stocks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-slate-400" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-700">No results found</p>
        <p className="text-xs text-slate-400 mt-1">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-card animate-slide-up">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80">
            <th
              className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-400 cursor-pointer hover:text-slate-600 select-none"
              onClick={() => handleSort('symbol')}
            >
              Symbol <SortIcon active={sortKey === 'symbol'} dir={sortDir} />
            </th>
            <th className={thClass('currentPrice')} onClick={() => handleSort('currentPrice')}>
              Price <SortIcon active={sortKey === 'currentPrice'} dir={sortDir} />
            </th>
            <th className={thClass('change')} onClick={() => handleSort('change')}>
              Change ($) <SortIcon active={sortKey === 'change'} dir={sortDir} />
            </th>
            <th className={thClass('percentChange')} onClick={() => handleSort('percentChange')}>
              Change (%) <SortIcon active={sortKey === 'percentChange'} dir={sortDir} />
            </th>
            <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
              High
            </th>
            <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden lg:table-cell">
              Low
            </th>
            <th className="px-6 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-400 hidden xl:table-cell">
              Prev Close
            </th>
            <th className="px-4 py-3 w-8" />
          </tr>
        </thead>
        <tbody>
          {loading
            ? <Loader />
            : sorted.map((stock, i) => (
              <StockRow key={stock.symbol} stock={stock} rank={i + 1} />
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;

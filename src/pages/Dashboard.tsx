import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import SearchBar from '../components/SearchBar';
import RefreshButton from '../components/RefreshButton';
import StockTable from '../components/StockTable';
import ErrorMessage from '../components/ErrorMessage';
import { useStocks } from '../hooks/useStocks';

const Dashboard: React.FC = () => {
  const { stocks, loading, error, lastUpdated, refresh } = useStocks();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return stocks;
    const q = search.toLowerCase();
    return stocks.filter(
      s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
    );
  }, [stocks, search]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header lastUpdated={lastUpdated} />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Summary cards */}
        {!error && (loading || stocks.length > 0) && (
          <section>
            {loading && stocks.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="stat-card">
                    <div className="skeleton h-9 w-9 rounded-lg mb-3" />
                    <div className="skeleton h-7 w-16 rounded mb-2" />
                    <div className="skeleton h-3 w-24 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <SummaryCards stocks={stocks} />
            )}
          </section>
        )}

        {/* Controls row */}
        <section className="flex items-center gap-4 flex-wrap">
          <SearchBar value={search} onChange={setSearch} resultCount={filtered.length} />

          <div className="flex items-center gap-3 ml-auto">
            {/* Stock count pill */}
            {!loading && stocks.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-card">
                <span className="text-xs text-slate-400 font-medium">Showing</span>
                <span className="text-xs font-bold text-slate-700 tabular-nums">
                  {filtered.length}/{stocks.length}
                </span>
              </div>
            )}
            <RefreshButton onRefresh={refresh} loading={loading} />
          </div>
        </section>

        {/* Main content */}
        <section>
          {error ? (
            <div className="bg-white rounded-xl border border-slate-200 shadow-card">
              <ErrorMessage message={error} onRetry={refresh} />
            </div>
          ) : (
            <StockTable stocks={filtered} loading={loading && stocks.length === 0} />
          )}
        </section>

        {/* Footer note */}
        <footer className="text-center pt-4 pb-2">
          <p className="text-xs text-slate-400">
            Data provided by{' '}
            <a
              href="https://finnhub.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors font-medium"
            >
              Finnhub
            </a>
            {' '}· Prices delayed ≤1 min · Click a row for details
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;

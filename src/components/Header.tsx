import React from 'react';

interface HeaderProps {
  lastUpdated: Date | null;
}

const Header: React.FC<HeaderProps> = ({ lastUpdated }) => {
  const formatted = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : null;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTILV2Z6-uOx02bnrMv2VybscyDCz05I-Gn5A&s" alt="Logo" className="w-8 h-8 rounded-lg" />
            <div>
              <h1 className="text-[15px] font-semibold text-slate-900 leading-tight tracking-tight">
                ValueGlance
              </h1>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest leading-tight">
                Market Overview
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Live</span>
            </div>

            {/* Last updated */}
            {formatted && (
              <div className="hidden sm:block text-right">
                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Updated</p>
                <p className="text-xs font-mono text-slate-600">{formatted}</p>
              </div>
            )}

            {/* Powered by */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Powered by</span>
              <span className="text-[11px] font-semibold text-slate-600">Finnhub</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

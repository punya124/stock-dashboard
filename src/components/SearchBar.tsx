import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  resultCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, resultCount }) => (
  <div className="relative flex-1 max-w-sm">
    {/* Search icon */}
    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
      <svg className="w-4 h-4 text-slate-400" viewBox="0 0 16 16" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 10 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>

    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search symbol or company…"
      className="
        w-full pl-9 pr-4 py-2.5
        bg-white border border-slate-200 rounded-lg
        text-sm text-slate-800 placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400
        transition-all duration-150
      "
    />

    {/* Clear button */}
    {value && (
      <button
        onClick={() => onChange('')}
        className="absolute inset-y-0 right-2.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M4 4 L12 12 M12 4 L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    )}

    {/* Result count badge */}
    {value && (
      <div className="absolute -bottom-5 left-0 text-[10px] text-slate-400 font-medium">
        {resultCount} result{resultCount !== 1 ? 's' : ''}
      </div>
    )}
  </div>
);

export default SearchBar;

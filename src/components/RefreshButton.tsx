import React, { useState } from 'react';

interface RefreshButtonProps {
  onRefresh: () => void;
  loading: boolean;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, loading }) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (loading) return;
    setClicked(true);
    onRefresh();
    setTimeout(() => setClicked(false), 600);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="
        inline-flex items-center gap-2
        px-4 py-2.5 rounded-lg
        bg-blue-600 hover:bg-blue-700 active:bg-blue-800
        text-white text-sm font-semibold
        shadow-sm shadow-blue-200
        transition-all duration-150
        disabled:opacity-60 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      <svg
        className={`w-4 h-4 transition-transform ${loading || clicked ? 'animate-spin' : ''}`}
        viewBox="0 0 16 16" fill="none"
      >
        <path
          d="M14 8a6 6 0 1 1-1.17-3.54"
          stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        />
        <path d="M14 3.5 V8 H9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {loading ? 'Refreshing…' : 'Refresh'}
    </button>
  );
};

export default RefreshButton;

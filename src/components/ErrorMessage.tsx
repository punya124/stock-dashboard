import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
      <svg className="w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>
    </div>
    <h3 className="text-base font-semibold text-slate-800 mb-1">Unable to load market data</h3>
    <p className="text-sm text-slate-500 max-w-sm mb-1">
      {message.includes('401') || message.includes('403')
        ? 'Your API key is invalid or missing. Add VITE_FINNHUB_API_KEY to your .env file.'
        : message.includes('429')
        ? 'Rate limit reached. Finnhub free tier allows 60 calls/min.'
        : 'Could not connect to Finnhub. Check your connection and API key.'}
    </p>
    <p className="text-xs text-slate-400 font-mono mb-6 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
      {message}
    </p>
    <button
      onClick={onRetry}
      className="
        inline-flex items-center gap-2 px-5 py-2.5
        bg-blue-600 hover:bg-blue-700 text-white
        text-sm font-semibold rounded-lg
        shadow-sm transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      "
    >
      <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M14 8a6 6 0 1 1-1.17-3.54" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M14 3.5 V8 H9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Try again
    </button>
  </div>
);

export default ErrorMessage;

import React, { useState } from 'react';
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import type { CandleData } from '../types/stock';
import { formatPrice } from '../utils/format';

interface CandlestickChartProps {
  data: CandleData[];
  symbol: string;
}

// Recharts passes these props to the custom shape
interface ShapeProps {
  x?: number;
  width?: number;
  payload?: CandleData;
  yAxis?: { scale?: (v: number) => number };
}

const CandleShape: React.FC<ShapeProps> = ({ x = 0, width = 0, payload, yAxis }) => {
  if (!payload || !yAxis?.scale) return null;

  const scale   = yAxis.scale;
  const { open, close, high, low } = payload;
  const isUp    = close >= open;
  const color   = isUp ? '#10b981' : '#ef4444';

  const bodyTop = scale(Math.max(open, close));
  const bodyBot = scale(Math.min(open, close));
  const wickTop = scale(high);
  const wickBot = scale(low);
  const bodyH   = Math.max(bodyBot - bodyTop, 1);
  const cx      = x + width / 2;
  const candleW = Math.max(width * 0.6, 2);

  return (
    <g>
      <line x1={cx} y1={wickTop} x2={cx} y2={wickBot} stroke={color} strokeWidth={1.5} />
      <rect
        x={cx - candleW / 2}
        y={bodyTop}
        width={candleW}
        height={bodyH}
        fill={color}
        fillOpacity={isUp ? 0.15 : 0.9}
        stroke={color}
        strokeWidth={1.5}
        rx={1}
      />
    </g>
  );
};

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: CandleData }>;
}

const CandleTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const isUp = d.close >= d.open;
  const pctChange = ((d.close - d.open) / d.open * 100).toFixed(2);

  return (
    <div className="bg-slate-900 text-white rounded-xl px-4 py-3 shadow-xl text-xs font-mono border border-slate-700">
      <p className="text-slate-400 font-sans font-medium mb-2 text-[11px]">{d.date}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span className="text-slate-400">Open</span>  <span className="text-right">{formatPrice(d.open)}</span>
        <span className="text-slate-400">Close</span> <span className={`text-right ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>{formatPrice(d.close)}</span>
        <span className="text-slate-400">High</span>  <span className="text-right text-emerald-400">{formatPrice(d.high)}</span>
        <span className="text-slate-400">Low</span>   <span className="text-right text-red-400">{formatPrice(d.low)}</span>
      </div>
      <div className={`mt-2 pt-2 border-t border-slate-700 text-center font-semibold ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? '▲' : '▼'} {Math.abs(Number(pctChange))}%
      </div>
    </div>
  );
};

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, symbol }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const tickInterval = Math.max(1, Math.floor(data.length / 8));

  const prices = data.flatMap(d => [d.high, d.low]);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);
  const pad  = (maxP - minP) * 0.05;

  const first = data[0];
  const last  = data[data.length - 1];
  const totalChange    = last.close - first.open;
  const totalChangePct = (totalChange / first.open * 100).toFixed(2);
  const isPositive     = totalChange >= 0;

  return (
    <div className="w-full">
      {/* Chart header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">3-Month Performance</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-lg font-bold text-slate-900 font-mono">{formatPrice(last.close)}</span>
            <span className={`text-sm font-mono font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
              {isPositive ? '▲' : '▼'} {formatPrice(Math.abs(totalChange))} ({Math.abs(Number(totalChangePct))}%)
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">90d Range</span>
          <p className="text-xs font-mono text-slate-600 mt-0.5">
            {formatPrice(Math.min(...data.map(d => d.low)))}
            <span className="text-slate-300 mx-1">–</span>
            {formatPrice(Math.max(...data.map(d => d.high)))}
          </p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <ComposedChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          onMouseMove={(state) => {
            const idx = state?.activeTooltipIndex;
            setHoveredIdx(typeof idx === 'number' ? idx : null);
          }}
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'Inter' }}
            tickLine={false}
            axisLine={false}
            interval={tickInterval}
          />
          <YAxis
            domain={[minP - pad, maxP + pad]}
            tick={{ fontSize: 10, fill: '#94a3b8', fontFamily: 'JetBrains Mono, monospace' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) => `$${v.toFixed(0)}`}
            width={52}
          />
          <Tooltip
            content={<CandleTooltip />}
            cursor={{ stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 2' }}
          />
          <Bar
            dataKey="high"
            shape={(props: unknown) => <CandleShape {...(props as ShapeProps)} />}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-out"
          >
            {data.map((_, idx) => (
              <Cell
                key={`cell-${idx}`}
                opacity={hoveredIdx === null || hoveredIdx === idx ? 1 : 0.35}
              />
            ))}
          </Bar>
        </ComposedChart>
      </ResponsiveContainer>

      <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
        {symbol} · Daily candles · {data.length} trading days
      </p>
    </div>
  );
};

export default CandlestickChart;

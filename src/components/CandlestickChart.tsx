import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface CandleData {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
}

interface SimpleLineChartProps {
  data: CandleData[];
  symbol: string;
}

const CandlestickChart: React.FC<SimpleLineChartProps> = ({ data, symbol }) => {
  const formattedData = data.map(d => ({
    date: d.date,
    price: d.close,
  }));

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 uppercase tracking-wider">
          3-Month Performance
        </p>
        <h2 className="text-lg font-semibold text-slate-900">
          {symbol}
        </h2>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={formattedData}>
          <CartesianGrid stroke="#f1f5f9" vertical={false} />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            tickLine={false}
            axisLine={false}
            domain={['auto', 'auto']}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
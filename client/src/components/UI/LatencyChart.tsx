import { useState } from "react";
import { useMapStore } from "../../lib/stores/useMapStore";
import { useRealLatencyData } from "../../hooks/useRealLatencyData";

type TimeRange = '1h' | '24h' | '7d' | '30d';

export default function LatencyChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>('24h');
  const { setShowLatencyChart } = useMapStore();
  const { historicalData, hasApiKey, error } = useRealLatencyData();

  const timeRanges = [
    { key: '1h' as TimeRange, label: '1 Hour' },
    { key: '24h' as TimeRange, label: '24 Hours' },
    { key: '7d' as TimeRange, label: '7 Days' },
    { key: '30d' as TimeRange, label: '30 Days' },
  ];

  // Get sample data for the chart
  const chartData = historicalData[selectedRange] || [];
  const maxLatency = Math.max(...chartData.map(d => d.latency), 100);

  return (
    <div className="absolute bottom-4 right-4 z-20">
      <div className="bg-black bg-opacity-90 rounded-lg p-6 text-white w-96">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Latency Trends</h3>
          <button
            onClick={() => setShowLatencyChart(false)}
            className="text-red-400 hover:text-red-300 text-xl"
          >
            ×
          </button>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-4">
          {timeRanges.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSelectedRange(key)}
              className={`px-3 py-1 rounded text-sm ${
                selectedRange === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* API Status */}
        {!hasApiKey && (
          <div className="mb-3 p-2 bg-yellow-800 bg-opacity-50 rounded text-xs">
            Using mock data. Add VITE_CLOUDFLARE_API_KEY for real data.
          </div>
        )}
        
        {error && (
          <div className="mb-3 p-2 bg-red-800 bg-opacity-50 rounded text-xs">
            API Error: {error}. Using fallback data.
          </div>
        )}

        {/* Chart Area */}
        <div className="h-48 bg-gray-900 rounded p-2 relative">
          <svg width="100%" height="100%" className="overflow-visible">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={`${(y / maxLatency) * 100}%`}
                x2="100%"
                y2={`${(y / maxLatency) * 100}%`}
                stroke="#374151"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}

            {/* Data line */}
            {chartData.length > 1 && (
              <polyline
                points={chartData.map((point, index) => {
                  const x = (index / (chartData.length - 1)) * 100;
                  const y = 100 - (point.latency / maxLatency) * 100;
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#3B82F6"
                strokeWidth="2"
              />
            )}

            {/* Data points */}
            {chartData.map((point, index) => {
              const x = (index / Math.max(chartData.length - 1, 1)) * 100;
              const y = 100 - (point.latency / maxLatency) * 100;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="#3B82F6"
                />
              );
            })}
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400 -ml-8">
            <span>{maxLatency}ms</span>
            <span>{Math.round(maxLatency * 0.75)}ms</span>
            <span>{Math.round(maxLatency * 0.5)}ms</span>
            <span>{Math.round(maxLatency * 0.25)}ms</span>
            <span>0ms</span>
          </div>
        </div>

        {/* Statistics */}
        {chartData.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Min</div>
              <div className="font-semibold text-green-400">
                {Math.min(...chartData.map(d => d.latency))}ms
              </div>
            </div>
            <div>
              <div className="text-gray-400">Avg</div>
              <div className="font-semibold text-yellow-400">
                {Math.round(chartData.reduce((a, b) => a + b.latency, 0) / chartData.length)}ms
              </div>
            </div>
            <div>
              <div className="text-gray-400">Max</div>
              <div className="font-semibold text-red-400">
                {Math.max(...chartData.map(d => d.latency))}ms
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

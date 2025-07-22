import { useMapStore } from "../../lib/stores/useMapStore";
import { useRealLatencyData } from "../../hooks/useRealLatencyData";

interface ExchangeInfoProps {
  exchange: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    cloudProvider: string;
    region?: string;
    type?: string;
  };
}

export default function ExchangeInfo({ exchange }: ExchangeInfoProps) {
  const { setSelectedExchange } = useMapStore();
  const { latencyData } = useRealLatencyData();

  // Get latency data for this exchange
  const exchangeLatencies = Object.entries(latencyData)
    .filter(([key]) => key.startsWith(exchange.id))
    .map(([key, latency]) => ({ connection: key, latency }));

  const avgLatency = exchangeLatencies.length > 0
    ? exchangeLatencies.reduce((sum, item) => sum + item.latency, 0) / exchangeLatencies.length
    : 0;

  return (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
      <div className="bg-black bg-opacity-90 rounded-lg p-6 text-white max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">{exchange.name}</h3>
          <button
            onClick={() => setSelectedExchange(null)}
            className="text-red-400 hover:text-red-300 text-xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {/* Basic Info */}
          <div>
            <div className="text-sm text-gray-400">Type</div>
            <div className="font-semibold">
              {exchange.type === 'region' ? 'Cloud Region' : 'Cryptocurrency Exchange'}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-400">Cloud Provider</div>
            <div className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full ${
                  exchange.cloudProvider === 'AWS' ? 'bg-orange-500' :
                  exchange.cloudProvider === 'GCP' ? 'bg-blue-500' : 'bg-purple-500'
                }`}
              />
              <span className="font-semibold">{exchange.cloudProvider}</span>
            </div>
          </div>

          {exchange.region && (
            <div>
              <div className="text-sm text-gray-400">Region</div>
              <div className="font-semibold">{exchange.region}</div>
            </div>
          )}

          <div>
            <div className="text-sm text-gray-400">Location</div>
            <div className="font-semibold">
              {exchange.latitude.toFixed(2)}°, {exchange.longitude.toFixed(2)}°
            </div>
          </div>

          {/* Latency Info */}
          {exchangeLatencies.length > 0 && (
            <>
              <hr className="border-gray-600" />
              <div>
                <div className="text-sm text-gray-400 mb-2">Average Latency</div>
                <div className={`text-2xl font-bold ${
                  avgLatency < 50 ? 'text-green-400' :
                  avgLatency < 100 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {Math.round(avgLatency)}ms
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-2">Connection Quality</div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    avgLatency < 50 ? 'bg-green-400' :
                    avgLatency < 100 ? 'bg-yellow-400' : 'bg-red-400'
                  }`} />
                  <span className="text-sm">
                    {avgLatency < 50 ? 'Excellent' :
                     avgLatency < 100 ? 'Good' : 'Poor'}
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="pt-2">
            <button
              onClick={() => {
                const { setShowLatencyChart } = useMapStore.getState();
                setShowLatencyChart(true);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              View Latency Trends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Download, Filter, Sliders } from "lucide-react";
import { useMapStore } from "../../lib/stores/useMapStore";

export default function ControlPanel() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { 
    visibleProviders, 
    toggleProvider, 
    showConnections, 
    setShowConnections,
    setShowLatencyChart,
    latencyFilter,
    setLatencyFilter,
    exportData,
    isMobile,
    setIsMobile
  } = useMapStore();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);

  return (
    <div className={`absolute top-4 right-4 z-20 ${isMobile ? 'right-2 top-2' : ''}`}>
      <div className={`bg-black bg-opacity-80 rounded-lg p-4 text-white ${isMobile ? 'min-w-72' : 'min-w-64'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Filter size={16} />
            Controls
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
        </div>

        <div className="space-y-3">
          {/* Cloud Provider Filters */}
          <div>
            <h4 className="text-sm font-medium mb-2">Cloud Providers</h4>
            <div className="space-y-2">
              {['AWS', 'GCP', 'Azure'].map((provider) => (
                <label key={provider} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleProviders.includes(provider)}
                    onChange={() => toggleProvider(provider)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">{provider}</span>
                  <div 
                    className={`w-3 h-3 rounded-full ${
                      provider === 'AWS' ? 'bg-orange-500' :
                      provider === 'GCP' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                  />
                </label>
              ))}
            </div>
          </div>

          {isExpanded && (
            <>
              {/* Connection Toggle */}
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showConnections}
                    onChange={(e) => setShowConnections(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm">Show Latency Connections</span>
                </label>
              </div>

              {/* Advanced Filters Toggle */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                >
                  <Sliders size={14} />
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
                </button>
              </div>

              {/* Advanced Filters */}
              {showAdvanced && (
                <div className="space-y-3 pt-2 border-t border-gray-600">
                  {/* Latency Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Latency Range (ms)</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={latencyFilter.min}
                        onChange={(e) => setLatencyFilter({ ...latencyFilter, min: parseInt(e.target.value) || 0 })}
                        className="w-16 bg-gray-800 text-white px-2 py-1 rounded text-xs border border-gray-600"
                        min="0"
                        max="500"
                      />
                      <span className="text-xs text-gray-400">to</span>
                      <input
                        type="number"
                        value={latencyFilter.max}
                        onChange={(e) => setLatencyFilter({ ...latencyFilter, max: parseInt(e.target.value) || 200 })}
                        className="w-16 bg-gray-800 text-white px-2 py-1 rounded text-xs border border-gray-600"
                        min="0"
                        max="500"
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Filter connections by latency range
                    </div>
                  </div>

                  {/* Quick Latency Presets */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Quick Filters</label>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setLatencyFilter({ min: 0, max: 50 })}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-xs transition-colors"
                      >
                        Excellent
                      </button>
                      <button
                        onClick={() => setLatencyFilter({ min: 50, max: 100 })}
                        className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-xs transition-colors"
                      >
                        Good
                      </button>
                      <button
                        onClick={() => setLatencyFilter({ min: 100, max: 500 })}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 rounded text-xs transition-colors"
                      >
                        Poor
                      </button>
                      <button
                        onClick={() => setLatencyFilter({ min: 0, max: 500 })}
                        className="px-2 py-1 bg-gray-600 hover:bg-gray-700 rounded text-xs transition-colors"
                      >
                        All
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowLatencyChart(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  Show Latency Chart
                </button>
                
                <button
                  onClick={exportData}
                  className="w-full bg-green-600 hover:bg-green-700 px-3 py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={14} />
                  Export Data
                </button>
              </div>

              {/* Stats */}
              <div className="pt-2 border-t border-gray-600">
                <div className="text-xs text-gray-400">
                  <div>Latency Colors:</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-3 h-1 bg-green-500"></div>
                    <span>&lt;50ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-yellow-500"></div>
                    <span>50-100ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-1 bg-red-500"></div>
                    <span>&gt;100ms</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

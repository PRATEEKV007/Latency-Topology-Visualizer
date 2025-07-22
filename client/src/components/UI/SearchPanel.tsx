import { useState } from "react";
import { Search, X } from "lucide-react";
import { useMapStore } from "../../lib/stores/useMapStore";
import { exchanges } from "../../data/exchanges";
import { cloudRegions } from "../../data/cloudRegions";

export default function SearchPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { searchTerm, setSearchTerm, setSelectedExchange } = useMapStore();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    if (term.length < 2) {
      setResults([]);
      return;
    }

    const searchResults = [];
    
    // Search exchanges
    const matchedExchanges = exchanges.filter(exchange =>
      exchange.name.toLowerCase().includes(term.toLowerCase()) ||
      exchange.cloudProvider.toLowerCase().includes(term.toLowerCase()) ||
      exchange.region.toLowerCase().includes(term.toLowerCase())
    );
    
    searchResults.push(...matchedExchanges.map(ex => ({ ...ex, type: 'exchange' })));
    
    // Search cloud regions
    const matchedRegions = cloudRegions.filter(region =>
      region.regionName.toLowerCase().includes(term.toLowerCase()) ||
      region.provider.toLowerCase().includes(term.toLowerCase())
    );
    
    searchResults.push(...matchedRegions.map(region => ({ 
      ...region, 
      name: region.regionName,
      cloudProvider: region.provider,
      type: 'region' 
    })));
    
    setResults(searchResults.slice(0, 8)); // Limit to 8 results
  };

  const selectResult = (result: any) => {
    setSelectedExchange(result);
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30">
      <div className="relative">
        {/* Search Button */}
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="bg-black bg-opacity-80 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all"
          >
            <Search size={16} />
            <span>Search exchanges & regions</span>
          </button>
        )}

        {/* Search Input */}
        {isOpen && (
          <div className="bg-black bg-opacity-90 rounded-lg p-4 w-80">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search exchanges, regions, or providers..."
                className="w-full bg-gray-800 text-white pl-10 pr-10 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  clearSearch();
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Search Results */}
            {results.length > 0 && (
              <div className="mt-3 max-h-64 overflow-y-auto">
                <div className="text-xs text-gray-400 mb-2">
                  {results.length} results found
                </div>
                {results.map((result, index) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => selectResult(result)}
                    className="w-full text-left p-3 hover:bg-gray-800 rounded border-b border-gray-700 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-medium">{result.name}</div>
                        <div className="text-sm text-gray-400">
                          {result.type === 'exchange' ? 'Exchange' : 'Cloud Region'} • {result.cloudProvider}
                        </div>
                      </div>
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          result.cloudProvider === 'AWS' ? 'bg-orange-500' :
                          result.cloudProvider === 'GCP' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searchTerm.length >= 2 && results.length === 0 && (
              <div className="mt-3 text-center text-gray-400 py-4">
                No results found for "{searchTerm}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
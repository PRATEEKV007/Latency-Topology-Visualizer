import { create } from 'zustand';

interface MapState {
  // Selected exchange for info panel
  selectedExchange: any | null;
  setSelectedExchange: (exchange: any | null) => void;

  // Visible cloud providers
  visibleProviders: string[];
  toggleProvider: (provider: string) => void;

  // Show connections
  showConnections: boolean;
  setShowConnections: (show: boolean) => void;

  // Show latency chart
  showLatencyChart: boolean;
  setShowLatencyChart: (show: boolean) => void;

  // Filter by latency range
  latencyFilter: {
    min: number;
    max: number;
  };
  setLatencyFilter: (filter: { min: number; max: number }) => void;

  // Search functionality
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Theme toggle
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Mobile controls
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;

  // Export functionality
  exportData: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
  selectedExchange: null,
  setSelectedExchange: (exchange) => set({ selectedExchange: exchange }),

  visibleProviders: ['AWS', 'GCP', 'Azure'],
  toggleProvider: (provider) => set((state) => ({
    visibleProviders: state.visibleProviders.includes(provider)
      ? state.visibleProviders.filter(p => p !== provider)
      : [...state.visibleProviders, provider]
  })),

  showConnections: true,
  setShowConnections: (show) => set({ showConnections: show }),

  showLatencyChart: false,
  setShowLatencyChart: (show) => set({ showLatencyChart: show }),

  latencyFilter: { min: 0, max: 200 },
  setLatencyFilter: (filter) => set({ latencyFilter: filter }),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

  isMobile: false,
  setIsMobile: (mobile) => set({ isMobile: mobile }),

  exportData: () => {
    const state = get();
    const data = {
      selectedExchange: state.selectedExchange,
      visibleProviders: state.visibleProviders,
      latencyFilter: state.latencyFilter,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto-exchange-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },
}));

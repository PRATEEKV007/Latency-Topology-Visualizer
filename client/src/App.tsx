import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { OrbitControls, Stars } from "@react-three/drei";
import "@fontsource/inter";
import ExchangeMap from "./components/ExchangeMap";
import ControlPanel from "./components/UI/ControlPanel";
import LatencyChart from "./components/UI/LatencyChart";
import ExchangeInfo from "./components/UI/ExchangeInfo";
import SearchPanel from "./components/UI/SearchPanel";
import ThemeToggle from "./components/UI/ThemeToggle";
import PerformanceDashboard from "./components/UI/PerformanceDashboard";
import ExportPanel from "./components/UI/ExportPanel";
import ApiSetupBanner from "./components/UI/ApiSetupBanner";
import { useMapStore } from "./lib/stores/useMapStore";

function App() {
  const [loading, setLoading] = useState(true);
  const { selectedExchange, showLatencyChart, isDarkMode, isMobile } = useMapStore();

  const backgroundStyle = isDarkMode 
    ? { background: '#0a0a0a' }
    : { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };

  const canvasBackground = isDarkMode ? "#000510" : "#4a5568";

  return (
    <div 
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden',
        ...backgroundStyle
      }}
      className={isDarkMode ? 'dark' : ''}
    >
      {/* 3D Scene */}
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: isMobile ? 70 : 60,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          powerPreference: isMobile ? "default" : "high-performance"
        }}
        onCreated={() => setLoading(false)}
      >
        <color attach="background" args={[canvasBackground]} />
        
        {/* Lighting */}
        <ambientLight intensity={isDarkMode ? 0.3 : 0.5} />
        <directionalLight position={[10, 10, 5]} intensity={isDarkMode ? 1 : 1.2} />
        <pointLight position={[0, 0, 10]} intensity={isDarkMode ? 0.5 : 0.7} />
        
        {/* Stars background - only in dark mode */}
        {isDarkMode && (
          <Stars 
            radius={300} 
            depth={60} 
            count={isMobile ? 10000 : 20000} 
            factor={7} 
            saturation={0} 
            fade 
            speed={1} 
          />
        )}
        
        <Suspense fallback={null}>
          <ExchangeMap />
        </Suspense>
        
        {/* Camera controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
          autoRotateSpeed={0.5}
          touches={{
            ONE: isMobile ? 1 : 0, // Touch rotation for mobile
            TWO: isMobile ? 2 : 0  // Touch zoom for mobile
          }}
        />
      </Canvas>

      {/* Loading overlay */}
      {loading && (
        <div className={`absolute inset-0 flex items-center justify-center z-50 ${
          isDarkMode ? 'bg-black bg-opacity-75 text-white' : 'bg-white bg-opacity-75 text-black'
        }`}>
          <div className="text-xl">Loading 3D World Map...</div>
        </div>
      )}

      {/* Search Panel */}
      <SearchPanel />

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* UI Overlays */}
      <ControlPanel />
      
      {selectedExchange && (
        <ExchangeInfo exchange={selectedExchange} />
      )}
      
      {showLatencyChart && (
        <LatencyChart />
      )}

      {/* Performance Dashboard */}
      <PerformanceDashboard />

      {/* Export Panel */}
      <ExportPanel />

      {/* API Setup Banner */}
      <ApiSetupBanner />

      {/* Title and Legend */}
      <div className={`absolute top-4 left-4 z-10 ${
        isDarkMode ? 'text-white' : 'text-white'
      } ${isMobile ? 'left-2 top-2' : ''}`}>
        <h1 className={`font-bold mb-2 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
          Latency Topology Visualizer
        </h1>
        <div className={`opacity-75 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>AWS</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>GCP</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Azure</span>
          </div>
        </div>
      </div>

      {/* Performance info */}
      <div className={`absolute bottom-4 left-4 text-xs opacity-50 z-10 ${
        isDarkMode ? 'text-white' : 'text-white'
      } ${isMobile ? 'left-2 bottom-2 text-xs' : ''}`}>
        {isMobile 
          ? 'Touch to interact • Pinch to zoom' 
          : 'Click markers for exchange info • Mouse to rotate • Scroll to zoom'
        }
      </div>
    </div>
  );
}

export default App;

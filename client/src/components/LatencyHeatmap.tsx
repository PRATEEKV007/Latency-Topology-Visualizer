import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useLatencyData } from "../hooks/useLatencyData";
import { exchanges } from "../data/exchanges";
import { cloudRegions } from "../data/cloudRegions";
import { latLngToCartesian } from "../utils/geoUtils";
import { useMapStore } from "../lib/stores/useMapStore";

export default function LatencyHeatmap() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { latencyData } = useLatencyData();
  const { showConnections, visibleProviders } = useMapStore();

  // Create heatmap texture based on latency data
  const heatmapTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    
    // Clear with transparent background
    ctx.clearRect(0, 0, 512, 256);
    
    // Create heatmap points for each active connection
    const allLocations = [
      ...exchanges.filter(ex => visibleProviders.includes(ex.cloudProvider)),
      ...cloudRegions.filter(region => visibleProviders.includes(region.provider))
    ];
    
    allLocations.forEach((location) => {
      // Get average latency for this location
      const locationLatencies = Object.entries(latencyData)
        .filter(([key]) => key.includes(location.id))
        .map(([, latency]) => latency);
      
      if (locationLatencies.length === 0) return;
      
      const avgLatency = locationLatencies.reduce((sum, lat) => sum + lat, 0) / locationLatencies.length;
      
      // Convert lat/lng to canvas coordinates
      const x = ((location.longitude + 180) / 360) * 512;
      const y = ((90 - location.latitude) / 180) * 256;
      
      // Create gradient based on latency
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 40);
      
      if (avgLatency < 50) {
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.6)');  // Green
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
      } else if (avgLatency < 100) {
        gradient.addColorStop(0, 'rgba(234, 179, 8, 0.6)');  // Yellow
        gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.6)');  // Red
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      }
      
      ctx.fillStyle = gradient;
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(x, y, 40, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Apply blur for smoother heatmap
    ctx.filter = 'blur(3px)';
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(canvas, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, [latencyData, visibleProviders]);

  const heatmapMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      map: heatmapTexture,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }, [heatmapTexture]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle pulsing animation
      const pulse = 1 + 0.1 * Math.sin(state.clock.elapsedTime * 2);
      meshRef.current.scale.setScalar(pulse);
    }
  });

  if (!showConnections) return null;

  return (
    <mesh ref={meshRef} material={heatmapMaterial}>
      <sphereGeometry args={[2.02, 64, 32]} />
    </mesh>
  );
}
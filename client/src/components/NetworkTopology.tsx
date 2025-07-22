import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { latLngToCartesian } from "../utils/geoUtils";
import { exchanges } from "../data/exchanges";
import { useMapStore } from "../lib/stores/useMapStore";

export default function NetworkTopology() {
  const groupRef = useRef<THREE.Group>(null);
  const { visibleProviders, showConnections } = useMapStore();

  // Create network paths between major exchanges
  const networkPaths = useMemo(() => {
    const paths = [];
    const majorExchanges = exchanges.filter(ex => 
      visibleProviders.includes(ex.cloudProvider) && 
      ex.volume24h && ex.volume24h > 1000000000
    );

    // Create hub connections between major exchanges
    for (let i = 0; i < majorExchanges.length; i++) {
      for (let j = i + 1; j < majorExchanges.length; j++) {
        const exchange1 = majorExchanges[i];
        const exchange2 = majorExchanges[j];
        
        // Only connect exchanges in same or adjacent regions
        const pos1 = latLngToCartesian(exchange1.latitude, exchange1.longitude, 2.12);
        const pos2 = latLngToCartesian(exchange2.latitude, exchange2.longitude, 2.12);
        const distance = new THREE.Vector3(...pos1).distanceTo(new THREE.Vector3(...pos2));
        
        if (distance < 3) { // Only nearby exchanges
          paths.push({
            id: `${exchange1.id}-${exchange2.id}`,
            start: pos1,
            end: pos2,
            volume: (exchange1.volume24h + exchange2.volume24h) / 2,
            provider1: exchange1.cloudProvider,
            provider2: exchange2.cloudProvider
          });
        }
      }
    }

    return paths;
  }, [visibleProviders]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineBasicMaterial;
          // Animate opacity based on data flow
          const opacity = 0.3 + 0.2 * Math.sin(state.clock.elapsedTime * 2 + index);
          material.opacity = opacity;
        }
      });
    }
  });

  if (!showConnections) return null;

  return (
    <group ref={groupRef}>
      {networkPaths.map((path) => {
        // Create curved network path
        const startVec = new THREE.Vector3(...path.start);
        const endVec = new THREE.Vector3(...path.end);
        const midPoint = startVec.clone().add(endVec).multiplyScalar(0.5);
        midPoint.normalize().multiplyScalar(2.8); // Higher arc for network paths
        
        const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
        const points = curve.getPoints(15);

        // Color based on volume and providers
        const getNetworkColor = () => {
          if (path.provider1 === path.provider2) {
            // Same provider - stronger connection
            return path.provider1 === 'AWS' ? '#FF6B35' : 
                   path.provider1 === 'GCP' ? '#4285F4' : '#8B5CF6';
          }
          return '#9CA3AF'; // Cross-provider connections
        };

        return (
          <Line
            key={path.id}
            points={points}
            color={getNetworkColor()}
            lineWidth={Math.max(1, Math.log(path.volume / 1000000000) * 2)}
            transparent
            opacity={0.4}
            dashed
            dashSize={0.1}
            gapSize={0.05}
          />
        );
      })}
    </group>
  );
}
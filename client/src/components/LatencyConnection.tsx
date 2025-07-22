import { useMemo, useRef } from "react";
import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToCartesian } from "../utils/geoUtils";

interface LatencyConnectionProps {
  start: {
    latitude: number;
    longitude: number;
  };
  end: {
    latitude: number;
    longitude: number;
  };
  latency: number;
}

export default function LatencyConnection({ start, end, latency }: LatencyConnectionProps) {
  const lineRef = useRef<any>(null);

  // Convert positions to 3D coordinates
  const startPos = latLngToCartesian(start.latitude, start.longitude, 2.1);
  const endPos = latLngToCartesian(end.latitude, end.longitude, 2.1);

  // Create curved path between points
  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...startPos);
    const endVec = new THREE.Vector3(...endPos);
    
    // Create arc between points
    const midPoint = startVec.clone().add(endVec).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(2.5); // Raise the arc
    
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    return curve.getPoints(20);
  }, [startPos, endPos]);

  // Get color based on latency
  const getLatencyColor = (latency: number) => {
    if (latency < 50) return '#00FF00'; // Green - good
    if (latency < 100) return '#FFFF00'; // Yellow - medium
    return '#FF0000'; // Red - high
  };

  const color = getLatencyColor(latency);

  useFrame((state) => {
    if (lineRef.current) {
      // Animate opacity for pulse effect
      const opacity = 0.5 + 0.3 * Math.sin(state.clock.elapsedTime * 2);
      (lineRef.current.material as THREE.LineBasicMaterial).opacity = opacity;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={2}
      transparent
      opacity={0.7}
    />
  );
}

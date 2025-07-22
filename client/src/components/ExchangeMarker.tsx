import { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { latLngToCartesian } from "../utils/geoUtils";
import { useMapStore } from "../lib/stores/useMapStore";

interface ExchangeMarkerProps {
  exchange: {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    cloudProvider: string;
    type?: string;
  };
}

export default function ExchangeMarker({ exchange }: ExchangeMarkerProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { setSelectedExchange } = useMapStore();

  // Convert lat/lng to 3D position on sphere
  const position = latLngToCartesian(exchange.latitude, exchange.longitude, 2.1);

  // Get color based on cloud provider
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'aws': return '#FF9900';
      case 'gcp': return '#4285F4';
      case 'azure': return '#0078D4';
      default: return '#FFFFFF';
    }
  };

  const color = getProviderColor(exchange.cloudProvider);
  const isRegion = exchange.type === 'region';

  useFrame((state, delta) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y += delta * 2;
    }
  });

  const handleClick = () => {
    setSelectedExchange(exchange);
  };

  return (
    <group position={position}>
      {/* Marker */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {isRegion ? (
          <boxGeometry args={[0.08, 0.08, 0.08]} />
        ) : (
          <sphereGeometry args={[0.06, 16, 16]} />
        )}
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Pulse effect */}
      {!isRegion && (
        <mesh>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.2}
          />
        </mesh>
      )}

      {/* Label */}
      {hovered && (
        <Text
          position={[0, 0.15, 0]}
          fontSize={0.05}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {exchange.name}
        </Text>
      )}

      {/* Glow effect when hovered */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
}

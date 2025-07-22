import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToCartesian } from "../utils/geoUtils";
import { exchanges } from "../data/exchanges";
import { useMapStore } from "../lib/stores/useMapStore";

interface FlowParticle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
  exchangeId: string;
}

export default function VolumeFlow() {
  const pointsRef = useRef<THREE.Points>(null);
  const { visibleProviders, showConnections } = useMapStore();
  
  const particles = useMemo(() => {
    const particleArray: FlowParticle[] = [];
    const visibleExchanges = exchanges.filter(ex => visibleProviders.includes(ex.cloudProvider));
    
    visibleExchanges.forEach((exchange) => {
      if (!exchange.volume24h) return;
      
      const particleCount = Math.min(20, Math.max(5, Math.log(exchange.volume24h / 1000000000) * 8));
      const basePosition = latLngToCartesian(exchange.latitude, exchange.longitude, 2.15);
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 0.1 + Math.random() * 0.2;
        
        const position = new THREE.Vector3(
          basePosition[0] + Math.cos(angle) * radius,
          basePosition[1] + (Math.random() - 0.5) * 0.1,
          basePosition[2] + Math.sin(angle) * radius
        );
        
        const velocity = new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.01,
          (Math.random() - 0.5) * 0.02
        );
        
        const color = new THREE.Color(
          exchange.cloudProvider === 'AWS' ? '#FF9900' :
          exchange.cloudProvider === 'GCP' ? '#4285F4' : '#8B5CF6'
        );
        
        particleArray.push({
          position: position.clone(),
          velocity,
          life: Math.random() * 100,
          maxLife: 100 + Math.random() * 50,
          size: 0.02 + Math.random() * 0.03,
          color,
          exchangeId: exchange.id
        });
      }
    });
    
    return particleArray;
  }, [visibleProviders]);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particles.length * 3);
    const colors = new Float32Array(particles.length * 3);
    const sizes = new Float32Array(particles.length);
    
    particles.forEach((particle, i) => {
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      
      colors[i * 3] = particle.color.r;
      colors[i * 3 + 1] = particle.color.g;
      colors[i * 3 + 2] = particle.color.b;
      
      sizes[i] = particle.size;
    });
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const mat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    });
    
    return { geometry: geo, material: mat };
  }, [particles]);

  useFrame((state, delta) => {
    if (!pointsRef.current || !showConnections) return;
    
    const positions = geometry.attributes.position.array as Float32Array;
    const colors = geometry.attributes.color.array as Float32Array;
    const sizes = geometry.attributes.size.array as Float32Array;
    
    particles.forEach((particle, i) => {
      // Update particle position
      particle.position.add(particle.velocity.clone().multiplyScalar(delta * 60));
      particle.life += delta * 60;
      
      // Reset particle if life exceeded
      if (particle.life > particle.maxLife) {
        const exchange = exchanges.find(ex => ex.id === particle.exchangeId);
        if (exchange) {
          const basePosition = latLngToCartesian(exchange.latitude, exchange.longitude, 2.15);
          const angle = Math.random() * Math.PI * 2;
          const radius = 0.1 + Math.random() * 0.2;
          
          particle.position.set(
            basePosition[0] + Math.cos(angle) * radius,
            basePosition[1] + (Math.random() - 0.5) * 0.1,
            basePosition[2] + Math.sin(angle) * radius
          );
          particle.life = 0;
        }
      }
      
      // Update buffer arrays
      positions[i * 3] = particle.position.x;
      positions[i * 3 + 1] = particle.position.y;
      positions[i * 3 + 2] = particle.position.z;
      
      // Fade out near end of life
      const lifeFactor = 1 - (particle.life / particle.maxLife);
      const alpha = Math.sin(lifeFactor * Math.PI);
      
      colors[i * 3] = particle.color.r * alpha;
      colors[i * 3 + 1] = particle.color.g * alpha;
      colors[i * 3 + 2] = particle.color.b * alpha;
      
      sizes[i] = particle.size * alpha;
    });
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.size.needsUpdate = true;
  });

  if (!showConnections) return null;

  return (
    <points ref={pointsRef} geometry={geometry} material={material} />
  );
}
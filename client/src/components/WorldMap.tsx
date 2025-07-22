import { useRef, useMemo } from "react";
import { Mesh } from "three";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function WorldMap() {
  const meshRef = useRef<Mesh>(null);
  const wireframeRef = useRef<Mesh>(null);

  // Create realistic Earth texture with accurate continents
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Create realistic ocean background with depth
    const oceanGradient = ctx.createRadialGradient(512, 256, 0, 512, 256, 600);
    oceanGradient.addColorStop(0, '#1e7fb8');
    oceanGradient.addColorStop(0.6, '#1565c0');
    oceanGradient.addColorStop(1, '#0d47a1');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add deeper ocean trenches
    ctx.fillStyle = '#0a3d62';
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = 20 + Math.random() * 40;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    // North America - more realistic shape
    ctx.fillStyle = '#2d5016';
    ctx.beginPath();
    ctx.moveTo(50, 120);
    ctx.quadraticCurveTo(120, 80, 180, 100);
    ctx.quadraticCurveTo(200, 140, 170, 180);
    ctx.quadraticCurveTo(100, 200, 60, 170);
    ctx.closePath();
    ctx.fill();
    
    // Add Greenland
    ctx.fillStyle = '#e8f5e8';
    ctx.beginPath();
    ctx.ellipse(200, 60, 15, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // South America
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.moveTo(140, 240);
    ctx.quadraticCurveTo(160, 220, 180, 260);
    ctx.quadraticCurveTo(190, 320, 170, 380);
    ctx.quadraticCurveTo(150, 390, 130, 360);
    ctx.quadraticCurveTo(120, 300, 140, 240);
    ctx.closePath();
    ctx.fill();
    
    // Africa
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.moveTo(480, 180);
    ctx.quadraticCurveTo(520, 160, 540, 200);
    ctx.quadraticCurveTo(550, 280, 530, 340);
    ctx.quadraticCurveTo(500, 380, 470, 350);
    ctx.quadraticCurveTo(460, 280, 480, 180);
    ctx.closePath();
    ctx.fill();
    
    // Europe
    ctx.fillStyle = '#32cd32';
    ctx.beginPath();
    ctx.moveTo(480, 120);
    ctx.quadraticCurveTo(520, 100, 560, 120);
    ctx.quadraticCurveTo(580, 140, 560, 160);
    ctx.quadraticCurveTo(520, 170, 480, 150);
    ctx.closePath();
    ctx.fill();
    
    // Asia - large landmass
    ctx.fillStyle = '#9acd32';
    ctx.beginPath();
    ctx.moveTo(580, 100);
    ctx.quadraticCurveTo(700, 80, 800, 120);
    ctx.quadraticCurveTo(850, 160, 820, 200);
    ctx.quadraticCurveTo(750, 220, 650, 200);
    ctx.quadraticCurveTo(600, 160, 580, 100);
    ctx.closePath();
    ctx.fill();
    
    // China/Mongolia - different shade
    ctx.fillStyle = '#7cfc00';
    ctx.beginPath();
    ctx.ellipse(720, 140, 80, 40, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // India
    ctx.fillStyle = '#adff2f';
    ctx.beginPath();
    ctx.moveTo(650, 200);
    ctx.quadraticCurveTo(680, 180, 700, 220);
    ctx.quadraticCurveTo(690, 260, 660, 250);
    ctx.quadraticCurveTo(640, 230, 650, 200);
    ctx.closePath();
    ctx.fill();
    
    // Australia
    ctx.fillStyle = '#daa520';
    ctx.beginPath();
    ctx.ellipse(800, 350, 60, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Antarctica
    ctx.fillStyle = '#f0f8ff';
    ctx.fillRect(0, 450, 1024, 62);
    
    // Add mountain ranges and details
    ctx.fillStyle = '#654321';
    ctx.globalAlpha = 0.6;
    
    // Rocky Mountains
    for (let i = 0; i < 10; i++) {
      const x = 80 + i * 15;
      const y = 130 + Math.random() * 40;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Andes Mountains
    for (let i = 0; i < 15; i++) {
      const x = 145 + Math.random() * 20;
      const y = 260 + i * 8;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Himalayas
    for (let i = 0; i < 20; i++) {
      const x = 650 + i * 8;
      const y = 180 + Math.random() * 20;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
    
    // Add cloud formations
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.3;
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const radius = 10 + Math.random() * 20;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }, []);

  // Create realistic Earth material
  const earthMaterial = useMemo(() => new THREE.MeshLambertMaterial({
    map: earthTexture,
    transparent: false,
  }), [earthTexture]);

  // Create subtle continent outline wireframe
  const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.1,
  }), []);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation to show it's a globe
      meshRef.current.rotation.y += delta * 0.1;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <group>
      {/* Main Earth sphere with continents */}
      <mesh ref={meshRef} material={earthMaterial}>
        <sphereGeometry args={[2, 64, 32]} />
      </mesh>
      
      {/* Subtle continent wireframe overlay */}
      <mesh ref={wireframeRef} material={wireframeMaterial}>
        <sphereGeometry args={[2.002, 64, 32]} />
      </mesh>
      
      {/* Atmospheric layers for realism */}
      
      {/* Outer atmosphere - blue glow */}
      <mesh>
        <sphereGeometry args={[2.2, 32, 16]} />
        <meshBasicMaterial
          color={0x87ceeb}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Middle atmosphere */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 16]} />
        <meshBasicMaterial
          color={0x6bb6ff}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Inner atmosphere - subtle surface glow */}
      <mesh>
        <sphereGeometry args={[2.03, 32, 16]} />
        <meshBasicMaterial
          color={0xffffff}
          transparent
          opacity={0.02}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
}

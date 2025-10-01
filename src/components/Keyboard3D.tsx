import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { KeycapConfig } from '@/types/keyboard';
import * as THREE from 'three';

interface Keycap3DProps {
  keycap: KeycapConfig;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

const Keycap3D: React.FC<Keycap3DProps> = ({ keycap, selected, onClick, onDoubleClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      if (selected) {
        meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 0.1;
      }
    }
  });

  const UNIT_SIZE = 0.5;
  const KEYCAP_HEIGHT = 0.08;

  return (
    <group position={[keycap.x * UNIT_SIZE, 0, keycap.y * UNIT_SIZE]}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[keycap.width * UNIT_SIZE, KEYCAP_HEIGHT, UNIT_SIZE]} />
        <meshPhysicalMaterial
          color={keycap.color}
          metalness={0.1}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          emissive={selected ? '#4f46e5' : hovered ? '#6366f1' : '#000000'}
          emissiveIntensity={selected ? 0.3 : hovered ? 0.1 : 0}
        />
      </mesh>
      
      {/* Legend Text */}
      <mesh position={[0, KEYCAP_HEIGHT + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[keycap.width * UNIT_SIZE * 0.8, UNIT_SIZE * 0.8]} />
        <meshBasicMaterial 
          transparent
          color={keycap.textColor}
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

interface Keyboard3DProps {
  layout: any;
  selectedKeys: string[];
  onKeySelect: (keyId: string) => void;
  onKeyDoubleClick: (keyId: string) => void;
}

const Keyboard3D: React.FC<Keyboard3DProps> = ({
  layout,
  selectedKeys,
  onKeySelect,
  onKeyDoubleClick,
}) => {
  return (
    <div className="h-96 w-full bg-gradient-to-b from-card to-background rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [5, 8, 5], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Environment preset="studio" />
        
        {/* Keyboard base */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <boxGeometry args={[layout.width * 0.5 + 1, 0.1, layout.height * 0.5 + 1]} />
          <meshPhysicalMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.2}
            clearcoat={0.5}
          />
        </mesh>
        
        {/* Keycaps */}
        {layout.keys.map((keycap: KeycapConfig) => (
          <Keycap3D
            key={keycap.id}
            keycap={keycap}
            selected={selectedKeys.includes(keycap.id)}
            onClick={() => onKeySelect(keycap.id)}
            onDoubleClick={() => onKeyDoubleClick(keycap.id)}
          />
        ))}
        
        <ContactShadows
          opacity={0.4}
          scale={layout.width * 0.5 + 2}
          blur={2.5}
          far={4.5}
          position={[0, -0.1, 0]}
        />
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default Keyboard3D;
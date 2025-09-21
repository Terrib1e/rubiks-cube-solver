import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import { CubeService } from '../../services/CubeService';
import { CubeState } from '../../types/cube.types';
import Piece from './Piece';

interface CubeProps {
  size?: number;
  onStateChange?: (state: CubeState) => void;
}

const CubeScene: React.FC<{ cubeService: CubeService; onStateChange?: (state: CubeState) => void }> = ({
  cubeService,
  onStateChange
}) => {
  const groupRef = useRef<Group>(null);
  const [cubeState, setCubeState] = useState<CubeState>(cubeService.getState());

  useFrame(() => {
    const newState = cubeService.getState();
    if (newState !== cubeState) {
      setCubeState(newState);
      onStateChange?.(newState);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient light */}
      <ambientLight intensity={0.6} />

      {/* Directional light */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Cube pieces */}
      {cubeState.pieces.map((piece) => (
        <Piece
          key={piece.id}
          piece={piece}
          size={0.98} // Slightly smaller to show gaps between pieces
        />
      ))}

      {/* Helper grids and axes (optional, for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <gridHelper args={[10, 10]} />
          <axesHelper args={[2]} />
        </>
      )}
    </group>
  );
};

const Cube: React.FC<CubeProps> = ({ size = 3, onStateChange }) => {
  const [cubeService] = useState(() => new CubeService(size));

  return (
    <div style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 75 }}
        style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)' }}
      >
        <PerspectiveCamera makeDefault position={[5, 5, 5]} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI}
        />

        <CubeScene cubeService={cubeService} onStateChange={onStateChange} />
      </Canvas>
    </div>
  );
};

export default Cube;
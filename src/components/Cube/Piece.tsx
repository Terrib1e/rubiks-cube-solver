import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Vector3, Quaternion } from 'three';
import { Piece as PieceType } from '../../types/cube.types';
import Sticker from './Sticker';

interface PieceProps {
  piece: PieceType;
  size?: number;
  animating?: boolean;
  targetPosition?: Vector3;
  targetRotation?: Quaternion;
  animationSpeed?: number;
}

const Piece: React.FC<PieceProps> = ({
  piece,
  size = 1,
  animating = false,
  targetPosition,
  targetRotation,
  animationSpeed = 0.1
}) => {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current || !animating) return;

    if (targetPosition) {
      groupRef.current.position.lerp(targetPosition, animationSpeed);
    }

    if (targetRotation) {
      groupRef.current.quaternion.slerp(targetRotation, animationSpeed);
    }
  });

  const getStickerData = () => {
    interface StickerData {
      color: string;
      position: Vector3;
      rotation: [number, number, number];
    }

    const stickers: StickerData[] = [];
    const offset = size / 2 + 0.01; // Slight offset to prevent z-fighting

    // Only show stickers for faces that have colors
    const colorEntries = Object.entries(piece.colors || {});

    colorEntries.forEach(([faceKey, color]) => {
      if (!color) return;

      switch (faceKey) {
        case 'front':
          stickers.push({
            color,
            position: new Vector3(0, 0, offset),
            rotation: [0, 0, 0]
          });
          break;
        case 'back':
          stickers.push({
            color,
            position: new Vector3(0, 0, -offset),
            rotation: [0, Math.PI, 0]
          });
          break;
        case 'up':
          stickers.push({
            color,
            position: new Vector3(0, offset, 0),
            rotation: [-Math.PI / 2, 0, 0]
          });
          break;
        case 'down':
          stickers.push({
            color,
            position: new Vector3(0, -offset, 0),
            rotation: [Math.PI / 2, 0, 0]
          });
          break;
        case 'right':
          stickers.push({
            color,
            position: new Vector3(offset, 0, 0),
            rotation: [0, Math.PI / 2, 0]
          });
          break;
        case 'left':
          stickers.push({
            color,
            position: new Vector3(-offset, 0, 0),
            rotation: [0, -Math.PI / 2, 0]
          });
          break;
      }
    });

    return stickers;
  };

  return (
    <group
      ref={groupRef}
      position={piece.position}
      quaternion={piece.rotation}
    >
      {/* Cube body */}
      <mesh>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Stickers */}
      {getStickerData().map((sticker, index) => (
        <Sticker
          key={index}
          color={sticker.color}
          position={sticker.position}
          rotation={sticker.rotation}
          size={size * 0.9}
        />
      ))}
    </group>
  );
};

export default Piece;
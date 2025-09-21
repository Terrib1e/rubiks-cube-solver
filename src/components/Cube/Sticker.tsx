import React from 'react';
import { Plane } from '@react-three/drei';
import { Vector3 } from 'three';

interface StickerProps {
  color: string;
  position: Vector3;
  rotation: [number, number, number];
  size?: number;
}

const Sticker: React.FC<StickerProps> = ({
  color,
  position,
  rotation,
  size = 0.9
}) => {
  return (
    <Plane
      args={[size, size]}
      position={position}
      rotation={rotation}
    >
      <meshBasicMaterial color={color} />
    </Plane>
  );
};

export default Sticker;
import { Vector3, Quaternion } from 'three';

export type Face = 'F' | 'B' | 'U' | 'D' | 'R' | 'L';
export type Direction = 'CW' | 'CCW';
export type PieceType = 'corner' | 'edge' | 'center';

export interface FaceColors {
  front?: string;
  back?: string;
  up?: string;
  down?: string;
  right?: string;
  left?: string;
}

export interface Piece {
  id: string;
  position: Vector3;
  rotation: Quaternion;
  colors: FaceColors;
  originalPosition: Vector3;
  type: PieceType;
}

export interface Move {
  notation: string;
  timestamp: number;
  duration: number;
  pieces: string[];
}

export interface Animation {
  id: string;
  pieces: string[];
  axis: Vector3;
  angle: number;
  duration: number;
  startTime: number;
}

export interface CubeState {
  size: number;
  pieces: Piece[];
  orientation: Quaternion;
  isScrambled: boolean;
  isSolved: boolean;
  moveHistory: Move[];
  currentMoveIndex: number;
  animationQueue: Animation[];
}

export interface CubeConfig {
  size: number;
  colors: {
    front: string;
    back: string;
    up: string;
    down: string;
    right: string;
    left: string;
  };
  animationSpeed: number;
}
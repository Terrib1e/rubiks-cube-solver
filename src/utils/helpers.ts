import { Vector3, Quaternion } from 'three';
import { Face, Direction } from '../types/cube.types';

export function parseMove(notation: string): { face: Face; direction: Direction; times: number } {
  const match = notation.match(/^([FBLRUD])(['2]?)$/);
  if (!match) {
    throw new Error(`Invalid move notation: ${notation}`);
  }

  const face = match[1] as Face;
  const modifier = match[2];

  let direction: Direction = 'CW';
  let times = 1;

  if (modifier === "'") {
    direction = 'CCW';
  } else if (modifier === '2') {
    times = 2;
  }

  return { face, direction, times };
}

export function formatTime(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const ms = Math.floor((milliseconds % 1000) / 10);

  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  } else {
    return `${seconds}.${ms.toString().padStart(2, '0')}`;
  }
}

export function generateScramble(length: number = 25): string[] {
  const faces: Face[] = ['F', 'B', 'U', 'D', 'R', 'L'];
  const modifiers = ['', "'", '2'];
  const scramble: string[] = [];
  let lastFace: Face | null = null;
  let lastOppositeFace: Face | null = null;

  const oppositeFaces: Record<Face, Face> = {
    'F': 'B', 'B': 'F',
    'U': 'D', 'D': 'U',
    'R': 'L', 'L': 'R'
  };

  const getAvailableFaces = (prevFace: Face | null, prevOppositeFace: Face | null) => {
    return faces.filter(face => {
      return face !== prevFace && face !== prevOppositeFace;
    });
  };

  for (let i = 0; i < length; i++) {
    const availableFaces = getAvailableFaces(lastFace, lastOppositeFace);
    const face = availableFaces[Math.floor(Math.random() * availableFaces.length)];
    const modifier = modifiers[Math.floor(Math.random() * modifiers.length)];

    scramble.push(face + modifier);

    lastOppositeFace = lastFace;
    lastFace = oppositeFaces[face];
  }

  return scramble;
}

export function calculateAverageTime(times: number[]): number {
  if (times.length === 0) return 0;
  if (times.length <= 2) return times.reduce((a, b) => a + b, 0) / times.length;

  const sorted = [...times].sort((a, b) => a - b);
  const trimCount = Math.floor(times.length * 0.1);
  const trimmed = sorted.slice(trimCount, -trimCount);

  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
}

export function calculateStandardDeviation(times: number[]): number {
  if (times.length <= 1) return 0;

  const mean = times.reduce((a, b) => a + b, 0) / times.length;
  const squaredDiffs = times.map(time => Math.pow(time - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / times.length;

  return Math.sqrt(variance);
}

export function isValidCubeState(pieces: any[]): boolean {
  if (pieces.length !== 26) return false; // 3x3 cube has 26 visible pieces

  const colorCounts: Record<string, number> = {};

  pieces.forEach(piece => {
    Object.values(piece.colors).forEach(color => {
      if (typeof color === 'string') {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
      }
    });
  });

  const expectedCount = 9; // Each face should have 9 stickers
  return Object.values(colorCounts).every(count => count === expectedCount);
}

export function rotateVector(vector: Vector3, axis: Vector3, angle: number): Vector3 {
  const quaternion = new Quaternion().setFromAxisAngle(axis.normalize(), angle);
  return vector.clone().applyQuaternion(quaternion);
}

export function getRotationAxis(face: Face): Vector3 {
  switch (face) {
    case 'F': return new Vector3(0, 0, 1);
    case 'B': return new Vector3(0, 0, -1);
    case 'U': return new Vector3(0, 1, 0);
    case 'D': return new Vector3(0, -1, 0);
    case 'R': return new Vector3(1, 0, 0);
    case 'L': return new Vector3(-1, 0, 0);
    default: return new Vector3(0, 0, 0);
  }
}

export function getRotationAngle(direction: Direction, times: number = 1): number {
  const baseAngle = Math.PI / 2; // 90 degrees
  const angle = baseAngle * times;
  return direction === 'CW' ? angle : -angle;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}
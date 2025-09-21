import { CubeConfig } from '../types/cube.types';

export const DEFAULT_CUBE_CONFIG: CubeConfig = {
  size: 3,
  colors: {
    front: '#ff4444',  // Red
    back: '#ff8800',   // Orange
    up: '#ffff00',     // Yellow
    down: '#ffffff',   // White
    right: '#00ff00',  // Green
    left: '#0044ff',   // Blue
  },
  animationSpeed: 300,
};

export const FACE_NORMALS = {
  F: [0, 0, 1],   // Front
  B: [0, 0, -1],  // Back
  U: [0, 1, 0],   // Up
  D: [0, -1, 0],  // Down
  R: [1, 0, 0],   // Right
  L: [-1, 0, 0],  // Left
} as const;

export const MOVE_NOTATIONS = [
  'F', "F'", 'F2',
  'B', "B'", 'B2',
  'U', "U'", 'U2',
  'D', "D'", 'D2',
  'R', "R'", 'R2',
  'L', "L'", 'L2',
  'M', "M'", 'M2',
  'E', "E'", 'E2',
  'S', "S'", 'S2',
  'x', "x'", 'x2',
  'y', "y'", 'y2',
  'z', "z'", 'z2',
] as const;

export const KEYBOARD_SHORTCUTS = {
  FACES: {
    'f': 'F',
    'F': "F'",
    'r': 'R',
    'R': "R'",
    'u': 'U',
    'U': "U'",
    'd': 'D',
    'D': "D'",
    'l': 'L',
    'L': "L'",
    'b': 'B',
    'B': "B'",
  },
  ROTATIONS: {
    'x': 'x',
    'X': "x'",
    'y': 'y',
    'Y': "y'",
    'z': 'z',
    'Z': "z'",
  },
  ACTIONS: {
    ' ': 'TIMER_TOGGLE',
    'Escape': 'CANCEL',
    'Enter': 'SOLVE',
    's': 'SCRAMBLE',
    'S': 'SCRAMBLE',
  },
} as const;

export const ANIMATION_SPEEDS = {
  VERY_SLOW: 1000,
  SLOW: 500,
  NORMAL: 300,
  FAST: 150,
  VERY_FAST: 75,
} as const;

export const CAMERA_POSITIONS = {
  PERSPECTIVE: { x: 5, y: 5, z: 5 },
  TOP: { x: 0, y: 10, z: 0 },
  FRONT: { x: 0, y: 0, z: 10 },
  RIGHT: { x: 10, y: 0, z: 0 },
} as const;

export const SOLVE_METHODS = {
  LAYER_BY_LAYER: 'layer-by-layer',
  CFOP: 'cfop',
  ROUX: 'roux',
  ZZ: 'zz',
} as const;

export const OLL_ALGORITHMS = {
  'OLL1': "R U2 R' U' R U' R'",
  'OLL2': "R U R' U R U2 R'",
  'OLL3': "R U R' U' R U R' U2 R U' R'",
  'OLL4': "R U R' U R U' R' U R U2 R'",
  'OLL5': "R U2 R2 U' R2 U' R2 U2 R",
  'OLL6': "R U2 R2 U' R U' R' U2 R",
  'OLL7': "R U R' U R U2 R'",
  'OLL8': "R U R' U' R U' R'",
} as const;

export const PLL_ALGORITHMS = {
  'Aa': "x R' U R' D2 R U' R' D2 R2",
  'Ab': "x R2 D2 R U R' D2 R U' R",
  'E': "x' R U' R' D R U R' D' R U R' D R U' R' D'",
  'F': "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
  'Ga': "R2 U R' U R' U' R U' R2 D U' R' U R D'",
  'Gb': "R' U' R U D' R2 U R' U R U' R U' R2 D",
  'Gc': "R2 U' R U' R U R' U R2 D' U R U' R' D",
  'Gd': "R U R' U' D R2 U' R U' R' U R' U R2 D'",
  'H': "M2 U M2 U2 M2 U M2",
  'Ja': "R' U L' U2 R U' R' U2 R L",
  'Jb': "R U R' F' R U R' U' R' F R2 U' R'",
  'Na': "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
  'Nb': "R' U R U' R' F' U' F R U R' F R' F' R U' R",
  'Ra': "R U R' F' R U2 R' U2 R' F R U R U2 R' U'",
  'Rb': "R' U2 R U2 R' F R U R' U' R' F' R2 U'",
  'T': "R U R' U' R' F R2 U' R' U' R U R' F'",
  'Ua': "R U' R U R U R U' R' U' R2",
  'Ub': "R2 U R U R' U' R' U' R' U R'",
  'V': "R' U R' U' y R' F' R2 U' R' U R' F R F",
  'Y': "F R U' R' U' R U R' F' R U R' U' R' F R F'",
  'Z': "M' U M2 U M2 U M' U2 M2",
} as const;
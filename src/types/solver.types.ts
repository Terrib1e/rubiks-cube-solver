export type SolveMethod = 'layer-by-layer' | 'cfop' | 'roux' | 'zz';

export interface Solution {
  moves: string[];
  method: SolveMethod;
  totalMoves: number;
  estimatedTime: number;
  phases: SolutionPhase[];
}

export interface SolutionPhase {
  name: string;
  moves: string[];
  description: string;
}

export interface SolverOptions {
  method: SolveMethod;
  maxMoves?: number;
  timeout?: number;
  optimizeForSpeed?: boolean;
}

export interface AlgorithmSet {
  name: string;
  algorithms: Record<string, string>;
  description: string;
}

export interface SolverStats {
  averageMoves: number;
  averageTime: number;
  successRate: number;
  methodDistribution: Record<SolveMethod, number>;
}
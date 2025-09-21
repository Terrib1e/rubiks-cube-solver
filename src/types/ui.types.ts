export interface UIState {
  isLoading: boolean;
  activePanel: 'controls' | 'solver' | 'statistics' | 'settings';
  showGrid: boolean;
  showAxes: boolean;
  cameraPosition: 'perspective' | 'top' | 'front' | 'right';
  theme: 'light' | 'dark';
}

export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  endTime: number | null;
  currentTime: number;
  inspectionTime: number;
  isInspecting: boolean;
}

export interface StatisticsData {
  sessionStats: SessionStats;
  personalBests: PersonalBests;
  recentSolves: SolveRecord[];
}

export interface SessionStats {
  totalSolves: number;
  averageTime: number;
  averageOf5: number;
  averageOf12: number;
  averageOf100: number;
  standardDeviation: number;
}

export interface PersonalBests {
  single: SolveRecord;
  averageOf5: SolveRecord[];
  averageOf12: SolveRecord[];
  averageOf100: SolveRecord[];
}

export interface SolveRecord {
  id: string;
  time: number;
  moves: number;
  date: Date;
  scramble: string;
  solution?: string[];
  dnf: boolean;
  plusTwo: boolean;
}

export interface KeyboardShortcut {
  key: string;
  action: string;
  description: string;
  category: 'cube' | 'solver' | 'timer' | 'ui';
}
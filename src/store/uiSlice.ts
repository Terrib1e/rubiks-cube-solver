import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, TimerState } from '../types/ui.types';

interface UISliceState extends UIState {
  timer: TimerState;
  sidebarOpen: boolean;
  debugMode: boolean;
  fullscreen: boolean;
}

const initialState: UISliceState = {
  isLoading: false,
  activePanel: 'controls',
  showGrid: false,
  showAxes: false,
  cameraPosition: 'perspective',
  theme: 'light',
  timer: {
    isRunning: false,
    startTime: null,
    endTime: null,
    currentTime: 0,
    inspectionTime: 15000, // 15 seconds
    isInspecting: false,
  },
  sidebarOpen: true,
  debugMode: false,
  fullscreen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setActivePanel: (state, action: PayloadAction<UIState['activePanel']>) => {
      state.activePanel = action.payload;
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    toggleAxes: (state) => {
      state.showAxes = !state.showAxes;
    },
    setCameraPosition: (state, action: PayloadAction<UIState['cameraPosition']>) => {
      state.cameraPosition = action.payload;
    },
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    toggleDebugMode: (state) => {
      state.debugMode = !state.debugMode;
    },
    toggleFullscreen: (state) => {
      state.fullscreen = !state.fullscreen;
    },
    // Timer actions
    startTimer: (state) => {
      state.timer.isRunning = true;
      state.timer.startTime = Date.now();
      state.timer.endTime = null;
      state.timer.isInspecting = false;
    },
    stopTimer: (state) => {
      state.timer.isRunning = false;
      state.timer.endTime = Date.now();
    },
    resetTimer: (state) => {
      state.timer.isRunning = false;
      state.timer.startTime = null;
      state.timer.endTime = null;
      state.timer.currentTime = 0;
      state.timer.isInspecting = false;
    },
    updateCurrentTime: (state, action: PayloadAction<number>) => {
      state.timer.currentTime = action.payload;
    },
    startInspection: (state) => {
      state.timer.isInspecting = true;
      state.timer.startTime = Date.now();
    },
    stopInspection: (state) => {
      state.timer.isInspecting = false;
    },
    setInspectionTime: (state, action: PayloadAction<number>) => {
      state.timer.inspectionTime = action.payload;
    },
  },
});

export const {
  setLoading,
  setActivePanel,
  toggleGrid,
  toggleAxes,
  setCameraPosition,
  setTheme,
  toggleSidebar,
  toggleDebugMode,
  toggleFullscreen,
  startTimer,
  stopTimer,
  resetTimer,
  updateCurrentTime,
  startInspection,
  stopInspection,
  setInspectionTime,
} = uiSlice.actions;

export default uiSlice.reducer;
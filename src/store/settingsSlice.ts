import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CubeConfig } from '../types/cube.types';
import { DEFAULT_CUBE_CONFIG } from '../utils/constants';

interface SettingsState {
  cubeConfig: CubeConfig;
  keybindings: Record<string, string>;
  preferences: {
    autoSave: boolean;
    soundEnabled: boolean;
    hapticFeedback: boolean;
    showNotations: boolean;
    showTips: boolean;
  };
}

const initialState: SettingsState = {
  cubeConfig: DEFAULT_CUBE_CONFIG,
  keybindings: {
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
    'x': 'x',
    'X': "x'",
    'y': 'y',
    'Y': "y'",
    'z': 'z',
    'Z': "z'",
    ' ': 'TIMER_TOGGLE',
    'Escape': 'CANCEL',
    'Enter': 'SOLVE',
    's': 'SCRAMBLE',
  },
  preferences: {
    autoSave: true,
    soundEnabled: true,
    hapticFeedback: false,
    showNotations: true,
    showTips: true,
  },
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateCubeConfig: (state, action: PayloadAction<Partial<CubeConfig>>) => {
      state.cubeConfig = { ...state.cubeConfig, ...action.payload };
    },
    setCubeSize: (state, action: PayloadAction<number>) => {
      state.cubeConfig.size = action.payload;
    },
    setAnimationSpeed: (state, action: PayloadAction<number>) => {
      state.cubeConfig.animationSpeed = action.payload;
    },
    updateCubeColors: (state, action: PayloadAction<Partial<CubeConfig['colors']>>) => {
      state.cubeConfig.colors = { ...state.cubeConfig.colors, ...action.payload };
    },
    resetColorsToDefault: (state) => {
      state.cubeConfig.colors = DEFAULT_CUBE_CONFIG.colors;
    },
    updateKeybinding: (state, action: PayloadAction<{ key: string; value: string }>) => {
      state.keybindings[action.payload.key] = action.payload.value;
    },
    resetKeybindings: (state) => {
      state.keybindings = initialState.keybindings;
    },
    updatePreferences: (state, action: PayloadAction<Partial<SettingsState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    togglePreference: (state, action: PayloadAction<keyof SettingsState['preferences']>) => {
      const key = action.payload;
      state.preferences[key] = !state.preferences[key];
    },
    resetAllSettings: () => {
      return initialState;
    },
  },
});

export const {
  updateCubeConfig,
  setCubeSize,
  setAnimationSpeed,
  updateCubeColors,
  resetColorsToDefault,
  updateKeybinding,
  resetKeybindings,
  updatePreferences,
  togglePreference,
  resetAllSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CubeState, Move } from '../types/cube.types';
import { Quaternion } from 'three';

interface CubeSliceState {
  current: CubeState | null;
  isAnimating: boolean;
  animationSpeed: number;
  showMoveHistory: boolean;
}

const initialState: CubeSliceState = {
  current: null,
  isAnimating: false,
  animationSpeed: 300,
  showMoveHistory: false,
};

const cubeSlice = createSlice({
  name: 'cube',
  initialState,
  reducers: {
    updateState: (state, action: PayloadAction<CubeState>) => {
      state.current = action.payload;
    },
    setAnimating: (state, action: PayloadAction<boolean>) => {
      state.isAnimating = action.payload;
    },
    setAnimationSpeed: (state, action: PayloadAction<number>) => {
      state.animationSpeed = action.payload;
    },
    toggleMoveHistory: (state) => {
      state.showMoveHistory = !state.showMoveHistory;
    },
    resetCube: (state) => {
      if (state.current) {
        state.current.pieces = state.current.pieces.map(piece => ({
          ...piece,
          position: piece.originalPosition.clone(),
          rotation: new Quaternion(),
        }));
        state.current.moveHistory = [];
        state.current.currentMoveIndex = -1;
        state.current.isSolved = true;
        state.current.isScrambled = false;
      }
    },
    addMove: (state, action: PayloadAction<Move>) => {
      if (state.current) {
        // Remove any moves after current index (for undo/redo)
        state.current.moveHistory = state.current.moveHistory.slice(
          0,
          state.current.currentMoveIndex + 1
        );

        // Add new move
        state.current.moveHistory.push(action.payload);
        state.current.currentMoveIndex++;
      }
    },
    undoMove: (state) => {
      if (state.current && state.current.currentMoveIndex >= 0) {
        state.current.currentMoveIndex--;
      }
    },
    redoMove: (state) => {
      if (
        state.current &&
        state.current.currentMoveIndex < state.current.moveHistory.length - 1
      ) {
        state.current.currentMoveIndex++;
      }
    },
    clearHistory: (state) => {
      if (state.current) {
        state.current.moveHistory = [];
        state.current.currentMoveIndex = -1;
      }
    },
  },
});

export const {
  updateState,
  setAnimating,
  setAnimationSpeed,
  toggleMoveHistory,
  resetCube,
  addMove,
  undoMove,
  redoMove,
  clearHistory,
} = cubeSlice.actions;

export default cubeSlice.reducer;
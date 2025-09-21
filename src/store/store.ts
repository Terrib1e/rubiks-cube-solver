import { configureStore } from '@reduxjs/toolkit';
import cubeSlice from './cubeSlice';
import uiSlice from './uiSlice';
import settingsSlice from './settingsSlice';

export const store = configureStore({
  reducer: {
    cube: cubeSlice,
    ui: uiSlice,
    settings: settingsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['cube/updateState'],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ['payload.pieces', 'payload.orientation'],
        // Ignore these paths in the state
        ignoredPaths: ['cube.pieces', 'cube.orientation'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
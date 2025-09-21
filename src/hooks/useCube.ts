import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { CubeService } from '../services/CubeService';
import { CubeState } from '../types/cube.types';
import { updateState, setAnimating, addMove } from '../store/cubeSlice';

export const useCube = (initialSize: number = 3) => {
  const dispatch = useDispatch();
  const cubeServiceRef = useRef(new CubeService(initialSize));
  const [cubeState, setCubeState] = useState<CubeState>(cubeServiceRef.current.getState());
  const [isAnimating, setIsAnimatingLocal] = useState(false);

  const updateCubeState = useCallback(() => {
    const newState = cubeServiceRef.current.getState();
    setCubeState(newState);
    dispatch(updateState(newState));
  }, [dispatch]);

  const performMove = useCallback(async (notation: string) => {
    if (isAnimating) return false;

    setIsAnimatingLocal(true);
    dispatch(setAnimating(true));

    try {
      await cubeServiceRef.current.performMove(notation);
      updateCubeState();

      // Add move to Redux store
      const moveHistory = cubeServiceRef.current.getMoveHistory();
      const latestMove = moveHistory[moveHistory.length - 1];
      if (latestMove) {
        dispatch(addMove(latestMove));
      }

      return true;
    } catch (error) {
      console.error('Error performing move:', error);
      return false;
    } finally {
      setIsAnimatingLocal(false);
      dispatch(setAnimating(false));
    }
  }, [isAnimating, dispatch, updateCubeState]);

  const scramble = useCallback(async (moves: number = 25) => {
    if (isAnimating) return false;

    setIsAnimatingLocal(true);
    dispatch(setAnimating(true));

    try {
      await cubeServiceRef.current.scramble(moves);
      updateCubeState();
      return true;
    } catch (error) {
      console.error('Error scrambling cube:', error);
      return false;
    } finally {
      setIsAnimatingLocal(false);
      dispatch(setAnimating(false));
    }
  }, [isAnimating, dispatch, updateCubeState]);

  const reset = useCallback(() => {
    if (isAnimating) return false;

    cubeServiceRef.current.reset();
    updateCubeState();
    return true;
  }, [isAnimating, updateCubeState]);

  const undo = useCallback(() => {
    if (isAnimating) return false;

    const success = cubeServiceRef.current.undo();
    if (success) {
      updateCubeState();
    }
    return success;
  }, [isAnimating, updateCubeState]);

  const redo = useCallback(() => {
    if (isAnimating) return false;

    const success = cubeServiceRef.current.redo();
    if (success) {
      updateCubeState();
    }
    return success;
  }, [isAnimating, updateCubeState]);

  const getCubeService = useCallback(() => {
    return cubeServiceRef.current;
  }, []);

  return {
    cubeState,
    isAnimating,
    performMove,
    scramble,
    reset,
    undo,
    redo,
    getCubeService,
    updateCubeState
  };
};
import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
import { store, RootState } from './store/store';
import Header from './components/Layout/Header';
import Cube from './components/Cube/Cube';
import ControlPanel from './components/Controls/ControlPanel';
import Timer from './components/Statistics/Timer';
import SolverEngine from './components/Solver/SolverEngine';
import { useCube } from './hooks/useCube';
import { useKeyboard } from './hooks/useKeyboard';
import { startTimer, stopTimer, resetTimer } from './store/uiSlice';
import { useDispatch } from 'react-redux';
import { Solution } from './types/solver.types';
import './App.css';

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const activePanel = useSelector((state: RootState) => state.ui.activePanel);
  const timer = useSelector((state: RootState) => state.ui.timer);

  const {
    cubeState,
    isAnimating,
    performMove,
    scramble,
    reset,
    undo,
    redo
  } = useCube(3);

  const [, setCurrentSolution] = useState<Solution | null>(null);

  const handleToggleTimer = () => {
    if (timer.isRunning) {
      dispatch(stopTimer());
    } else {
      dispatch(resetTimer());
      dispatch(startTimer());
    }
  };

  // Set up keyboard controls
  useKeyboard({
    onMove: performMove,
    onScramble: scramble,
    onReset: reset,
    onUndo: undo,
    onRedo: redo,
    onToggleTimer: handleToggleTimer,
    disabled: isAnimating
  });

  const handleSolutionGenerated = (solution: Solution) => {
    setCurrentSolution(solution);
  };

  const handleApplySolution = async (moves: string[]) => {
    for (const move of moves) {
      await performMove(move);
      // Add a small delay between moves for visualization
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const handleSolveComplete = (time: number) => {
    console.log(`Solve completed in ${time}ms`);
  };

  const renderActivePanel = () => {
    switch (activePanel) {
      case 'controls':
        return (
          <ControlPanel
            onMove={performMove}
            onScramble={scramble}
            onReset={reset}
            onUndo={undo}
            onRedo={redo}
            animationSpeed={300}
            onSpeedChange={(speed) => console.log('Speed changed:', speed)}
            disabled={isAnimating}
          />
        );
      case 'solver':
        return (
          <SolverEngine
            cubeState={cubeState}
            onSolutionGenerated={handleSolutionGenerated}
            onApplySolution={handleApplySolution}
            disabled={isAnimating}
          />
        );
      case 'statistics':
        return <Timer onSolveComplete={handleSolveComplete} />;
      case 'settings':
        return (
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">Settings panel coming soon...</p>
          </div>
        );
      default:
        return (
          <ControlPanel
            onMove={performMove}
            onScramble={scramble}
            onReset={reset}
            onUndo={undo}
            onRedo={redo}
            animationSpeed={300}
            onSpeedChange={(speed) => console.log('Speed changed:', speed)}
            disabled={isAnimating}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cube Display */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="h-96 lg:h-[600px]">
                <Cube onStateChange={(state) => {}} />
              </div>

              {/* Cube Status */}
              {cubeState && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${cubeState.isSolved ? 'bg-green-100 text-green-800' :
                          cubeState.isScrambled ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'}
                      `}>
                        {cubeState.isSolved ? 'Solved' :
                         cubeState.isScrambled ? 'Scrambled' : 'Ready'}
                      </span>
                      <span className="text-gray-600">
                        Size: {cubeState.size}x{cubeState.size}
                      </span>
                      <span className="text-gray-600">
                        Moves: {cubeState.moveHistory.length}
                      </span>
                    </div>

                    {isAnimating && (
                      <span className="text-blue-600 font-medium">
                        Animating...
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {renderActivePanel()}
          </div>
        </div>

        {/* Move History */}
        {cubeState && cubeState.moveHistory.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Move History</h3>
            <div className="flex flex-wrap gap-2">
              {cubeState.moveHistory.map((move, index) => (
                <span
                  key={index}
                  className={`
                    px-2 py-1 rounded text-sm font-mono
                    ${index <= cubeState.currentMoveIndex
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-500'
                    }
                  `}
                >
                  {move.notation}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Help */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Face Rotations</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><kbd className="px-1 bg-gray-100 rounded">f</kbd> = F, <kbd className="px-1 bg-gray-100 rounded">F</kbd> = F'</p>
                <p><kbd className="px-1 bg-gray-100 rounded">r</kbd> = R, <kbd className="px-1 bg-gray-100 rounded">R</kbd> = R'</p>
                <p><kbd className="px-1 bg-gray-100 rounded">u</kbd> = U, <kbd className="px-1 bg-gray-100 rounded">U</kbd> = U'</p>
                <p><kbd className="px-1 bg-gray-100 rounded">d</kbd> = D, <kbd className="px-1 bg-gray-100 rounded">D</kbd> = D'</p>
                <p><kbd className="px-1 bg-gray-100 rounded">l</kbd> = L, <kbd className="px-1 bg-gray-100 rounded">L</kbd> = L'</p>
                <p><kbd className="px-1 bg-gray-100 rounded">b</kbd> = B, <kbd className="px-1 bg-gray-100 rounded">B</kbd> = B'</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Cube Rotations</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><kbd className="px-1 bg-gray-100 rounded">x</kbd> = x, <kbd className="px-1 bg-gray-100 rounded">X</kbd> = x'</p>
                <p><kbd className="px-1 bg-gray-100 rounded">y</kbd> = y, <kbd className="px-1 bg-gray-100 rounded">Y</kbd> = y'</p>
                <p><kbd className="px-1 bg-gray-100 rounded">z</kbd> = z, <kbd className="px-1 bg-gray-100 rounded">Z</kbd> = z'</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Actions</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><kbd className="px-1 bg-gray-100 rounded">Space</kbd> = Timer</p>
                <p><kbd className="px-1 bg-gray-100 rounded">s</kbd> = Scramble</p>
                <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+Z</kbd> = Undo</p>
                <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+Y</kbd> = Redo</p>
                <p><kbd className="px-1 bg-gray-100 rounded">Ctrl+R</kbd> = Reset</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
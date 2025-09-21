import React, { useState } from 'react';
import { SolverService } from '../../services/SolverService';
import { Solution, SolveMethod } from '../../types/solver.types';
import { CubeState } from '../../types/cube.types';

interface SolverEngineProps {
  cubeState: CubeState | null;
  onSolutionGenerated: (solution: Solution) => void;
  onApplySolution: (moves: string[]) => void;
  disabled?: boolean;
}

const SolverEngine: React.FC<SolverEngineProps> = ({
  cubeState,
  onSolutionGenerated,
  onApplySolution,
  disabled = false
}) => {
  const [solver] = useState(() => new SolverService());
  const [selectedMethod, setSelectedMethod] = useState<SolveMethod>('layer-by-layer');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSolution, setCurrentSolution] = useState<Solution | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const availableMethods = solver.getAvailableMethods();

  const handleGenerateSolution = async () => {
    if (!cubeState || disabled || isGenerating) return;

    if (cubeState.isSolved) {
      alert('Cube is already solved!');
      return;
    }

    setIsGenerating(true);
    try {
      const solution = await solver.solve(cubeState, selectedMethod);
      setCurrentSolution(solution);
      onSolutionGenerated(solution);
    } catch (error) {
      console.error('Error generating solution:', error);
      alert('Failed to generate solution. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplySolution = async () => {
    if (!currentSolution || isApplying) return;

    setIsApplying(true);
    try {
      onApplySolution(currentSolution.moves);
    } catch (error) {
      console.error('Error applying solution:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyPhase = async (phaseIndex: number) => {
    if (!currentSolution || isApplying) return;

    const phase = currentSolution.phases[phaseIndex];
    if (phase) {
      setIsApplying(true);
      try {
        onApplySolution(phase.moves);
      } catch (error) {
        console.error('Error applying phase:', error);
      } finally {
        setIsApplying(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cube Solver</h2>

        {/* Method Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Solving Method
          </label>
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value as SolveMethod)}
            disabled={disabled || isGenerating || isApplying}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {availableMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            {availableMethods.find(m => m.value === selectedMethod)?.description}
          </p>
        </div>

        {/* Generate Solution Button */}
        <button
          onClick={handleGenerateSolution}
          disabled={disabled || isGenerating || isApplying || !cubeState}
          className={`
            w-full px-4 py-2 rounded-md font-medium transition-colors
            ${disabled || isGenerating || isApplying || !cubeState
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }
          `}
        >
          {isGenerating ? 'Generating...' : 'Generate Solution'}
        </button>
      </div>

      {/* Current Solution */}
      {currentSolution && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              {currentSolution.method.toUpperCase()} Solution
            </h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>Total moves: {currentSolution.totalMoves}</p>
              <p>Estimated time: {Math.round(currentSolution.estimatedTime / 1000)}s</p>
              <p>Phases: {currentSolution.phases.length}</p>
            </div>
          </div>

          {/* Apply Solution Button */}
          <button
            onClick={handleApplySolution}
            disabled={disabled || isApplying}
            className={`
              w-full px-4 py-2 rounded-md font-medium transition-colors
              ${disabled || isApplying
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
              }
            `}
          >
            {isApplying ? 'Applying...' : 'Apply Complete Solution'}
          </button>

          {/* Solution Phases */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Solution Phases</h4>
            {currentSolution.phases.map((phase, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-gray-800">{phase.name}</h5>
                  <span className="text-sm text-gray-500">
                    {phase.moves.length} moves
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">{phase.description}</p>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {phase.moves.map((move, moveIndex) => (
                      <span
                        key={moveIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono"
                      >
                        {move}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleApplyPhase(index)}
                  disabled={disabled || isApplying}
                  className={`
                    px-3 py-1 rounded text-sm font-medium transition-colors
                    ${disabled || isApplying
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-500 hover:bg-gray-600 text-white'
                    }
                  `}
                >
                  Apply Phase
                </button>
              </div>
            ))}
          </div>

          {/* Full Move Sequence */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-800 mb-2">Complete Move Sequence</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex flex-wrap gap-1">
                {currentSolution.moves.map((move, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white text-gray-700 rounded text-sm font-mono shadow-sm"
                  >
                    {move}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {cubeState?.isSolved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-green-500 text-xl">✓</span>
            </div>
            <div className="ml-3">
              <p className="text-green-800 font-medium">Cube is already solved!</p>
              <p className="text-green-700 text-sm">No solution needed.</p>
            </div>
          </div>
        </div>
      )}

      {!cubeState && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-yellow-500 text-xl">⚠</span>
            </div>
            <div className="ml-3">
              <p className="text-yellow-800 font-medium">No cube state available</p>
              <p className="text-yellow-700 text-sm">Please wait for the cube to load.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolverEngine;
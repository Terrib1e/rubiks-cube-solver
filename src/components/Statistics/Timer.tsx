import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { startTimer, stopTimer, resetTimer, updateCurrentTime, startInspection, stopInspection } from '../../store/uiSlice';
import { formatTime } from '../../utils/helpers';

interface TimerProps {
  onSolveComplete?: (time: number) => void;
}

const Timer: React.FC<TimerProps> = ({ onSolveComplete }) => {
  const dispatch = useDispatch();
  const timer = useSelector((state: RootState) => state.ui.timer);
  const cubeState = useSelector((state: RootState) => state.cube.current);
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isRunning || timer.isInspecting) {
      interval = setInterval(() => {
        const currentTime = Date.now();

        if (timer.isInspecting) {
          const elapsed = currentTime - (timer.startTime || 0);
          const remaining = Math.max(0, timer.inspectionTime - elapsed);
          setDisplayTime(remaining);

          if (remaining === 0) {
            dispatch(stopInspection());
            dispatch(startTimer());
          }
        } else if (timer.isRunning) {
          const elapsed = currentTime - (timer.startTime || 0);
          setDisplayTime(elapsed);
          dispatch(updateCurrentTime(elapsed));
        }
      }, 10); // Update every 10ms for smooth display
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isRunning, timer.isInspecting, timer.startTime, timer.inspectionTime, dispatch]);

  useEffect(() => {
    // Auto-stop timer when cube is solved
    if (cubeState?.isSolved && timer.isRunning) {
      dispatch(stopTimer());
      onSolveComplete?.(timer.currentTime);
    }
  }, [cubeState?.isSolved, timer.isRunning, timer.currentTime, dispatch, onSolveComplete]);

  useEffect(() => {
    const handleSpaceBar = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();

        if (timer.isRunning) {
          dispatch(stopTimer());
        } else if (timer.isInspecting) {
          dispatch(stopInspection());
          dispatch(startTimer());
        } else {
          dispatch(resetTimer());
          dispatch(startInspection());
        }
      }
    };

    window.addEventListener('keydown', handleSpaceBar);
    return () => window.removeEventListener('keydown', handleSpaceBar);
  }, [timer.isRunning, timer.isInspecting, dispatch]);

  const handleTimerClick = () => {
    if (timer.isRunning) {
      dispatch(stopTimer());
    } else if (timer.isInspecting) {
      dispatch(stopInspection());
      dispatch(startTimer());
    } else {
      dispatch(resetTimer());
      dispatch(startInspection());
    }
  };

  const handleReset = () => {
    dispatch(resetTimer());
    setDisplayTime(0);
  };

  const getTimerColor = () => {
    if (timer.isRunning) return 'text-green-600';
    if (timer.isInspecting) return 'text-yellow-600';
    if (timer.endTime) return 'text-blue-600';
    return 'text-gray-800';
  };

  const getTimerStatus = () => {
    if (timer.isRunning) return 'Solving...';
    if (timer.isInspecting) return 'Inspection';
    if (timer.endTime) return 'Completed';
    return 'Ready';
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Timer</h2>
        <div className={`text-sm font-medium ${getTimerColor()}`}>
          {getTimerStatus()}
        </div>
      </div>

      {/* Main Timer Display */}
      <div
        onClick={handleTimerClick}
        className={`
          text-6xl font-mono font-bold cursor-pointer select-none p-4 rounded-lg transition-all
          ${getTimerColor()}
          ${timer.isRunning ? 'bg-green-50' : timer.isInspecting ? 'bg-yellow-50' : 'bg-gray-50'}
          hover:bg-opacity-80
        `}
      >
        {timer.isInspecting
          ? Math.ceil(displayTime / 1000)
          : formatTime(displayTime)
        }
      </div>

      {/* Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleTimerClick}
          className={`
            px-6 py-2 rounded-md font-medium transition-colors
            ${timer.isRunning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
            }
          `}
        >
          {timer.isRunning ? 'Stop' : timer.isInspecting ? 'Start' : 'Inspect'}
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md font-medium transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600">
        <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Space</kbd> to control timer</p>
        {timer.isInspecting && (
          <p className="mt-1 text-yellow-600">
            Inspection: {Math.ceil(displayTime / 1000)}s remaining
          </p>
        )}
      </div>

      {/* Last Solve Time */}
      {timer.endTime && timer.startTime && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Last solve:</div>
          <div className="text-lg font-bold text-blue-600">
            {formatTime(timer.endTime - timer.startTime)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
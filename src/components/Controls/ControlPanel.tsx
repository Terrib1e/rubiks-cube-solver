import React from 'react';
import FaceButtons from './FaceButtons';
import SpeedSlider from './SpeedSlider';
import ColorPicker from './ColorPicker';

interface ControlPanelProps {
  onMove: (notation: string) => void;
  onScramble: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  animationSpeed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  onMove,
  onScramble,
  onReset,
  onUndo,
  onRedo,
  animationSpeed,
  onSpeedChange,
  disabled = false
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Cube Controls</h2>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={onScramble}
            disabled={disabled}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Scramble
          </button>
          <button
            onClick={onReset}
            disabled={disabled}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onUndo}
            disabled={disabled}
            className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Undo
          </button>
          <button
            onClick={onRedo}
            disabled={disabled}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            Redo
          </button>
        </div>
      </div>

      {/* Face Rotation Buttons */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Face Rotations</h3>
        <FaceButtons onMove={onMove} disabled={disabled} />
      </div>

      {/* Animation Speed Control */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Animation Speed</h3>
        <SpeedSlider
          value={animationSpeed}
          onChange={onSpeedChange}
          disabled={disabled}
        />
      </div>

      {/* Color Customization */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Colors</h3>
        <ColorPicker disabled={disabled} />
      </div>
    </div>
  );
};

export default ControlPanel;
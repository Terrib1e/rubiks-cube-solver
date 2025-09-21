import React from 'react';
import { Face } from '../../types/cube.types';

interface FaceButtonsProps {
  onMove: (notation: string) => void;
  disabled?: boolean;
}

const FaceButtons: React.FC<FaceButtonsProps> = ({ onMove, disabled = false }) => {
  const faces: { face: Face; label: string; color: string }[] = [
    { face: 'F', label: 'Front', color: 'bg-red-500 hover:bg-red-600' },
    { face: 'B', label: 'Back', color: 'bg-orange-500 hover:bg-orange-600' },
    { face: 'U', label: 'Up', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { face: 'D', label: 'Down', color: 'bg-white hover:bg-gray-100 text-black border border-gray-300' },
    { face: 'R', label: 'Right', color: 'bg-green-500 hover:bg-green-600' },
    { face: 'L', label: 'Left', color: 'bg-blue-500 hover:bg-blue-600' },
  ];

  const handleFaceClick = (face: Face, direction: 'CW' | 'CCW' | '180') => {
    let notation = face;
    if (direction === 'CCW') notation += "'";
    if (direction === '180') notation += '2';
    onMove(notation);
  };

  return (
    <div className="space-y-4">
      {faces.map(({ face, label, color }) => (
        <div key={face} className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 w-16">{label}</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleFaceClick(face, 'CW')}
              disabled={disabled}
              className={`${color} disabled:bg-gray-300 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors min-w-[60px]`}
            >
              {face}
            </button>
            <button
              onClick={() => handleFaceClick(face, 'CCW')}
              disabled={disabled}
              className={`${color} disabled:bg-gray-300 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors min-w-[60px]`}
            >
              {face}'
            </button>
            <button
              onClick={() => handleFaceClick(face, '180')}
              disabled={disabled}
              className={`${color} disabled:bg-gray-300 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors min-w-[60px]`}
            >
              {face}2
            </button>
          </div>
        </div>
      ))}

      {/* Cube Rotations */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Cube Rotations</h4>
        <div className="space-y-2">
          {['x', 'y', 'z'].map((rotation) => (
            <div key={rotation} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-16">{rotation.toUpperCase()}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => onMove(rotation)}
                  disabled={disabled}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors min-w-[60px]"
                >
                  {rotation}
                </button>
                <button
                  onClick={() => onMove(rotation + "'")}
                  disabled={disabled}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors min-w-[60px]"
                >
                  {rotation}'
                </button>
                <button
                  onClick={() => onMove(rotation + '2')}
                  disabled={disabled}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 disabled:text-gray-500 text-white px-3 py-1 rounded text-sm font-medium transition-colors min-w-[60px]"
                >
                  {rotation}2
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaceButtons;
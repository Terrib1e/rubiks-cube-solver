import React from 'react';
import { ANIMATION_SPEEDS } from '../../utils/constants';

interface SpeedSliderProps {
  value: number;
  onChange: (speed: number) => void;
  disabled?: boolean;
}

const SpeedSlider: React.FC<SpeedSliderProps> = ({ value, onChange, disabled = false }) => {
  const speedPresets = [
    { label: 'Very Slow', value: ANIMATION_SPEEDS.VERY_SLOW },
    { label: 'Slow', value: ANIMATION_SPEEDS.SLOW },
    { label: 'Normal', value: ANIMATION_SPEEDS.NORMAL },
    { label: 'Fast', value: ANIMATION_SPEEDS.FAST },
    { label: 'Very Fast', value: ANIMATION_SPEEDS.VERY_FAST },
  ];

  const getSpeedLabel = (speed: number): string => {
    const preset = speedPresets.find(p => p.value === speed);
    return preset ? preset.label : 'Custom';
  };

  return (
    <div className="space-y-4">
      {/* Current Speed Display */}
      <div className="text-center">
        <span className="text-sm font-medium text-gray-600">
          Current Speed: {getSpeedLabel(value)} ({value}ms)
        </span>
      </div>

      {/* Speed Slider */}
      <div className="px-2">
        <input
          type="range"
          min={ANIMATION_SPEEDS.VERY_FAST}
          max={ANIMATION_SPEEDS.VERY_SLOW}
          step={25}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            background: disabled
              ? '#e5e7eb'
              : `linear-gradient(to right, #10b981 0%, #10b981 ${
                  ((ANIMATION_SPEEDS.VERY_SLOW - value) / (ANIMATION_SPEEDS.VERY_SLOW - ANIMATION_SPEEDS.VERY_FAST)) * 100
                }%, #e5e7eb ${
                  ((ANIMATION_SPEEDS.VERY_SLOW - value) / (ANIMATION_SPEEDS.VERY_SLOW - ANIMATION_SPEEDS.VERY_FAST)) * 100
                }%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Fast</span>
          <span>Slow</span>
        </div>
      </div>

      {/* Speed Presets */}
      <div className="grid grid-cols-3 gap-2">
        {speedPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChange(preset.value)}
            disabled={disabled}
            className={`
              px-3 py-2 text-xs rounded-md font-medium transition-colors
              ${value === preset.value
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Speed Description */}
      <div className="text-xs text-gray-500 text-center">
        {value <= 100 && "⚡ Lightning fast - for speedcubers"}
        {value > 100 && value <= 200 && "🏃 Fast - smooth and quick"}
        {value > 200 && value <= 400 && "🚶 Normal - balanced speed"}
        {value > 400 && value <= 700 && "🐌 Slow - easy to follow"}
        {value > 700 && "🔍 Very slow - step by step"}
      </div>
    </div>
  );
};

export default SpeedSlider;
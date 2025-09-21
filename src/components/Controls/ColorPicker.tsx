import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCubeColors, resetColorsToDefault } from '../../store/settingsSlice';

interface ColorPickerProps {
  disabled?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const colors = useSelector((state: RootState) => state.settings.cubeConfig.colors);

  const colorFaces = [
    { key: 'front', label: 'Front (F)', defaultColor: '#ff4444' },
    { key: 'back', label: 'Back (B)', defaultColor: '#ff8800' },
    { key: 'up', label: 'Up (U)', defaultColor: '#ffff00' },
    { key: 'down', label: 'Down (D)', defaultColor: '#ffffff' },
    { key: 'right', label: 'Right (R)', defaultColor: '#00ff00' },
    { key: 'left', label: 'Left (L)', defaultColor: '#0044ff' },
  ];

  const handleColorChange = (face: string, color: string) => {
    dispatch(updateCubeColors({ [face]: color }));
  };

  const handleResetColors = () => {
    dispatch(resetColorsToDefault());
  };

  const getContrastColor = (hexColor: string): string => {
    // Convert hex to RGB
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate brightness
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // Return black or white based on brightness
    return brightness > 155 ? '#000000' : '#ffffff';
  };

  return (
    <div className="space-y-4">
      {/* Color Inputs */}
      <div className="space-y-3">
        {colorFaces.map(({ key, label, defaultColor }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded border-2 border-gray-300 flex items-center justify-center text-xs font-bold"
                style={{
                  backgroundColor: colors[key as keyof typeof colors],
                  color: getContrastColor(colors[key as keyof typeof colors]),
                }}
              >
                {key[0].toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={colors[key as keyof typeof colors]}
                onChange={(e) => handleColorChange(key, e.target.value)}
                disabled={disabled}
                className="w-8 h-8 rounded border-2 border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                onClick={() => handleColorChange(key, defaultColor)}
                disabled={disabled}
                className="text-xs text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Reset to default"
              >
                Reset
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Color Schemes */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Quick Schemes</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleResetColors}
            disabled={disabled}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Default
          </button>
          <button
            onClick={() => {
              dispatch(updateCubeColors({
                front: '#e74c3c',
                back: '#f39c12',
                up: '#f1c40f',
                down: '#ecf0f1',
                right: '#27ae60',
                left: '#3498db',
              }));
            }}
            disabled={disabled}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Flat
          </button>
          <button
            onClick={() => {
              dispatch(updateCubeColors({
                front: '#ff1744',
                back: '#ff9100',
                up: '#ffea00',
                down: '#fafafa',
                right: '#00e676',
                left: '#2196f3',
              }));
            }}
            disabled={disabled}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Bright
          </button>
          <button
            onClick={() => {
              dispatch(updateCubeColors({
                front: '#8b0000',
                back: '#ff8c00',
                up: '#ffd700',
                down: '#f5f5dc',
                right: '#006400',
                left: '#00008b',
              }));
            }}
            disabled={disabled}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Dark
          </button>
        </div>
      </div>

      {/* Color Blindness Support */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-600 mb-3">Accessibility</h4>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => {
              dispatch(updateCubeColors({
                front: '#e74c3c',
                back: '#f39c12',
                up: '#f1c40f',
                down: '#2c3e50',
                right: '#27ae60',
                left: '#3498db',
              }));
            }}
            disabled={disabled}
            className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            Colorblind Friendly
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
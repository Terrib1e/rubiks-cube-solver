import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setActivePanel, toggleSidebar, setTheme } from '../../store/uiSlice';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const { activePanel, theme, sidebarOpen } = useSelector((state: RootState) => state.ui);
  const cubeState = useSelector((state: RootState) => state.cube.current);

  const panels = [
    { id: 'controls', label: 'Controls' },
    { id: 'solver', label: 'Solver' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'settings', label: 'Settings' },
  ] as const;

  const handleThemeToggle = () => {
    dispatch(setTheme(theme === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">🎲</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Rubik's Cube Solver
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1">
            {panels.map((panel) => (
              <button
                key={panel.id}
                onClick={() => dispatch(setActivePanel(panel.id))}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium transition-colors
                  ${activePanel === panel.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                {panel.label}
              </button>
            ))}
          </nav>

          {/* Status and Actions */}
          <div className="flex items-center space-x-4">
            {/* Cube Status */}
            {cubeState && (
              <div className="hidden sm:flex items-center space-x-2">
                <div className={`
                  w-3 h-3 rounded-full
                  ${cubeState.isSolved ? 'bg-green-500' : cubeState.isScrambled ? 'bg-red-500' : 'bg-yellow-500'}
                `} />
                <span className="text-sm text-gray-600">
                  {cubeState.isSolved ? 'Solved' : cubeState.isScrambled ? 'Scrambled' : 'Ready'}
                </span>
                {cubeState.moveHistory.length > 0 && (
                  <span className="text-xs text-gray-500">
                    ({cubeState.moveHistory.length} moves)
                  </span>
                )}
              </div>
            )}

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            >
              {theme === 'light' ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Help/Info */}
            <button
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              title="Help & Shortcuts"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <nav className="px-4 py-2 space-x-1 overflow-x-auto flex">
          {panels.map((panel) => (
            <button
              key={panel.id}
              onClick={() => dispatch(setActivePanel(panel.id))}
              className={`
                px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors
                ${activePanel === panel.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {panel.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
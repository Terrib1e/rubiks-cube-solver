import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { KEYBOARD_SHORTCUTS } from '../utils/constants';

interface UseKeyboardProps {
  onMove: (notation: string) => void;
  onScramble: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleTimer: () => void;
  disabled?: boolean;
}

export const useKeyboard = ({
  onMove,
  onScramble,
  onReset,
  onUndo,
  onRedo,
  onToggleTimer,
  disabled = false
}: UseKeyboardProps) => {
  const keybindings = useSelector((state: RootState) => state.settings.keybindings);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // Prevent default behavior for our custom shortcuts
    const key = event.key;
    const isModifierPressed = event.ctrlKey || event.metaKey || event.altKey;

    // Handle Ctrl/Cmd + key combinations first
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'z':
          event.preventDefault();
          if (event.shiftKey) {
            onRedo();
          } else {
            onUndo();
          }
          return;
        case 'y':
          event.preventDefault();
          onRedo();
          return;
        case 'r':
          event.preventDefault();
          onReset();
          return;
        case 's':
          event.preventDefault();
          onScramble();
          return;
        default:
          return;
      }
    }

    // Don't process if modifier keys are pressed (except for specific cases above)
    if (isModifierPressed) return;

    // Don't process if user is typing in an input field
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Check for face rotations and cube rotations
    const notation = keybindings[key];
    if (notation && notation !== 'TIMER_TOGGLE' && notation !== 'CANCEL' && notation !== 'SOLVE' && notation !== 'SCRAMBLE') {
      event.preventDefault();
      onMove(notation);
      return;
    }

    // Handle special actions
    switch (key) {
      case ' ':
        event.preventDefault();
        onToggleTimer();
        break;
      case 'Escape':
        event.preventDefault();
        // Could add a cancel operation here
        break;
      case 'Enter':
        event.preventDefault();
        // Could trigger auto-solve here
        break;
      case 's':
      case 'S':
        if (!isModifierPressed) {
          event.preventDefault();
          onScramble();
        }
        break;
      default:
        break;
    }
  }, [keybindings, onMove, onScramble, onReset, onUndo, onRedo, onToggleTimer, disabled]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return current keybindings for display purposes
  return {
    keybindings,
    shortcuts: {
      faces: {
        'F': 'f / F (shift)',
        'R': 'r / R (shift)',
        'U': 'u / U (shift)',
        'D': 'd / D (shift)',
        'L': 'l / L (shift)',
        'B': 'b / B (shift)',
      },
      rotations: {
        'x': 'x / X (shift)',
        'y': 'y / Y (shift)',
        'z': 'z / Z (shift)',
      },
      actions: {
        'Timer': 'Space',
        'Scramble': 's / Ctrl+S',
        'Reset': 'Ctrl+R',
        'Undo': 'Ctrl+Z',
        'Redo': 'Ctrl+Y / Ctrl+Shift+Z',
      }
    }
  };
};
import { useCallback } from 'react';

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

export function useHaptics() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const trigger = useCallback((type: HapticType = 'medium') => {
    const patterns: Record<HapticType, number | number[]> = {
      light: 10,
      medium: 20,
      heavy: 40,
      success: [10, 50, 10],
      warning: [20, 100, 20],
      error: [40, 100, 40, 100, 40],
      selection: 5,
    };

    vibrate(patterns[type]);
  }, [vibrate]);

  const isSupported = 'vibrate' in navigator;

  return {
    trigger,
    vibrate,
    isSupported,
  };
}

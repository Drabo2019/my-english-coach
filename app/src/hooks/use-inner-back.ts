import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';

/**
 * Android hardware "Back" for screens that switch between sub-views with local state
 * (list -> exercise, session in progress…). While `active` and the screen is focused,
 * Back runs `onBack` instead of leaving the screen (or closing the app from a tab).
 */
export function useInnerBack(active: boolean, onBack: () => void) {
  useFocusEffect(
    useCallback(() => {
      if (!active) return;
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        onBack();
        return true;
      });
      return () => sub.remove();
    }, [active, onBack]),
  );
}

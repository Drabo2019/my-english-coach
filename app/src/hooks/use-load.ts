import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/** Runs an async loader every time the screen gains focus. */
export function useLoad<T>(loader: () => Promise<T>, deps: unknown[] = []): [T | null, () => void] {
  const [data, setData] = useState<T | null>(null);
  const [tick, setTick] = useState(0);
  const cb = useCallback(() => {
    let alive = true;
    loader().then((d) => alive && setData(d));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);
  useFocusEffect(cb);
  return [data, () => setTick((t) => t + 1)];
}

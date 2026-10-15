import { Appearance } from 'react-native';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { DEFAULT_PROFILE, DEFAULT_SETTINGS, getProfile, getSettings, setProfile, setSettings, type Settings } from '@/services/storage/repo';
import type { Profile } from '@/types';

interface Ctx {
  ready: boolean;
  profile: Profile;
  settings: Settings;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  reload: () => Promise<void>;
}

const AppContext = createContext<Ctx>({
  ready: false,
  profile: DEFAULT_PROFILE,
  settings: DEFAULT_SETTINGS,
  updateProfile: async () => {},
  updateSettings: async () => {},
  reload: async () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setP] = useState<Profile>(DEFAULT_PROFILE);
  const [settings, setS] = useState<Settings>(DEFAULT_SETTINGS);

  const reload = useCallback(async () => {
    setP(await getProfile());
    setS(await getSettings());
    setReady(true);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // "System" follows the phone; light/dark override it app-wide (navigation, status bar and our own theme).
  useEffect(() => {
    try {
      Appearance.setColorScheme(settings.themeMode === 'system' ? 'unspecified' : settings.themeMode);
    } catch {
      /* not supported on this platform */
    }
  }, [settings.themeMode]);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    const next = { ...(await getProfile()), ...patch };
    await setProfile(next);
    setP(next);
  }, []);
  const updateSettings = useCallback(async (patch: Partial<Settings>) => {
    const next = { ...(await getSettings()), ...patch };
    await setSettings(next);
    setS(next);
  }, []);

  const value = useMemo(
    () => ({ ready, profile, settings, updateProfile, updateSettings, reload }),
    [ready, profile, settings, updateProfile, updateSettings, reload],
  );
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

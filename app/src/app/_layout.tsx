import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AppProvider, useApp } from '@/features/app-context';
import { scheduleSmartReminder } from '@/services/notifications';

SplashScreen.preventAutoHideAsync();

function Gate() {
  const { ready, profile, settings } = useApp();
  const segments = useSegments();
  const scheme = useColorScheme();

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hideAsync();
    const inOnboarding = segments[0] === 'onboarding' || segments[0] === 'placement';
    if (!profile.onboarded && !inOnboarding) router.replace('/onboarding');
  }, [ready, profile.onboarded, segments]);

  // Re-schedule the evening reminder on each launch so its text reflects the latest data.
  useEffect(() => {
    if (ready && profile.onboarded) scheduleSmartReminder(settings.notifications).catch(() => {});
  }, [ready, profile.onboarded, settings.notifications]);

  if (!ready) return null;
  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerTitleStyle: { fontSize: 17 } }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="placement" options={{ title: 'Level check', headerBackVisible: false }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <Gate />
    </AppProvider>
  );
}

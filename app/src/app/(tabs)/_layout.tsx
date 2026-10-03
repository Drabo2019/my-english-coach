import { Tabs, router } from 'expo-router';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  return <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.55 }}>{emoji}</Text>;
}

/** "How do I say…?" is reachable from every tab (header button). */
const HowToSayButton = () => {
  const th = useTheme();
  return (
    <Pressable
      accessibilityLabel="How do I say…"
      onPress={() => router.push('/how-to-say')}
      style={{ marginRight: 12, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: th.accentSoft }}>
      <Text style={{ color: th.accent, fontWeight: '600' }}>💬 How do I say…?</Text>
    </Pressable>
  );
};

export default function TabsLayout() {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: th.background },
        headerTitleStyle: { color: th.text },
        headerShadowVisible: false,
        headerRight: () => <HowToSayButton />,
        tabBarStyle: { backgroundColor: th.card, borderTopColor: th.border, height: 58 + insets.bottom, paddingBottom: insets.bottom + 4, paddingTop: 4 },
        tabBarActiveTintColor: th.accent,
        tabBarInactiveTintColor: th.textSecondary,
        sceneStyle: { backgroundColor: th.background },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} /> }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarIcon: ({ focused }) => <TabIcon emoji="📚" focused={focused} /> }} />
      <Tabs.Screen name="speak" options={{ title: 'Speak', tabBarIcon: ({ focused }) => <TabIcon emoji="🎙️" focused={focused} /> }} />
      <Tabs.Screen name="review" options={{ title: 'Review', tabBarIcon: ({ focused }) => <TabIcon emoji="🔁" focused={focused} /> }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: ({ focused }) => <TabIcon emoji="📈" focused={focused} /> }} />
    </Tabs>
  );
}

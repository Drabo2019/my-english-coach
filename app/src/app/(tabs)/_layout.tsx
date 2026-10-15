import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import React from 'react';
import { Pressable, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/hooks/use-theme';
import { shareApp } from '@/services/share';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICON: Record<string, [IconName, IconName]> = {
  index: ['sunny-outline', 'sunny'],
  learn: ['book-outline', 'book'],
  speak: ['mic-outline', 'mic'],
  review: ['repeat-outline', 'repeat'],
  progress: ['stats-chart-outline', 'stats-chart'],
};

const tabIcon = (name: string) =>
  function TabBarIcon({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) {
    return <Ionicons name={TAB_ICON[name][focused ? 1 : 0]} size={size} color={color} />;
  };

/** Search, "How do I say…?" and Settings are reachable from every tab. */
const HEADER_ACTIONS: { icon: IconName; label: string; route?: string; run?: () => void }[] = [
  { icon: 'search-outline', label: 'Search', route: '/search' },
  { icon: 'chatbubble-ellipses-outline', label: 'How do I say…?', route: '/how-to-say' },
  { icon: 'share-social-outline', label: 'Share the app', run: shareApp },
  { icon: 'settings-outline', label: 'Settings', route: '/settings' },
];

function HeaderActions() {
  const th = useTheme();
  return (
    <View style={{ flexDirection: 'row', marginRight: 6 }}>
      {HEADER_ACTIONS.map((a) => (
        <Pressable
          key={a.label}
          accessibilityRole="button"
          accessibilityLabel={a.label}
          hitSlop={4}
          onPress={() => (a.run ? a.run() : router.push(a.route as never))}
          style={({ pressed }) => ({ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}>
          <Ionicons name={a.icon} size={22} color={th.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}

export default function TabsLayout() {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: th.background },
        headerTitleStyle: { color: th.text, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
        headerTitleAlign: 'left',
        headerShadowVisible: false,
        headerRight: () => <HeaderActions />,
        tabBarStyle: { backgroundColor: th.card, borderTopColor: th.border, height: 62 + insets.bottom, paddingBottom: insets.bottom + 6, paddingTop: 6 },
        tabBarActiveTintColor: th.accent,
        tabBarInactiveTintColor: th.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: th.background },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Today', tabBarIcon: tabIcon('index') }} />
      <Tabs.Screen name="learn" options={{ title: 'Learn', tabBarIcon: tabIcon('learn') }} />
      <Tabs.Screen name="speak" options={{ title: 'Speak', tabBarIcon: tabIcon('speak') }} />
      <Tabs.Screen name="review" options={{ title: 'Review', tabBarIcon: tabIcon('review') }} />
      <Tabs.Screen name="progress" options={{ title: 'Progress', tabBarIcon: tabIcon('progress') }} />
    </Tabs>
  );
}

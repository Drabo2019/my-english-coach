import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Reserved for moments that matter (a commit, a right or wrong answer). Never throws: haptics are a nicety.
const run = (fn: () => Promise<void>) => {
  if (Platform.OS === 'web') return;
  fn().catch(() => {});
};

export const hapticTap = () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
export const hapticSuccess = () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
export const hapticWarning = () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));

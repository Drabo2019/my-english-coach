import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { allCards, dueCards, secondsBySkill, topMistakes } from './storage/repo';

Notifications.setNotificationHandler({
  handleNotification: async () => ({ shouldShowBanner: true, shouldShowList: true, shouldPlaySound: false, shouldSetBadge: false }),
});

/** Builds a message from real data, never a generic "Time to study!". */
async function buildMessage(): Promise<{ title: string; body: string }> {
  const [week, due, mistakes, cards] = await Promise.all([secondsBySkill(2), dueCards(100), topMistakes(1), allCards()]);
  const spoke = (week['speaking'] ?? 0) + (week['conversation'] ?? 0);
  if (spoke < 60) return { title: 'Speaking time', body: 'You haven’t practiced speaking lately. Try a 3-minute conversation?' };
  const hard = cards.filter((c) => c.lapses >= 2).length;
  if (hard > 0) return { title: 'Words you forget', body: `You keep forgetting ${hard} item${hard > 1 ? 's' : ''}. Let’s practise them for 2 minutes.` };
  if (due.length > 0) return { title: 'Review', body: `${due.length} items are ready to review. 3 minutes is enough.` };
  if (mistakes[0]) return { title: 'Quick fix', body: `Remember: “${mistakes[0].correction}” (not “${mistakes[0].original}”). Say it once aloud.` };
  return { title: 'My English Coach', body: 'A 5-minute English session keeps the momentum going.' };
}

/** Schedules ONE notification for the next 19:00. Re-run on each app open so the content stays current. */
export async function scheduleSmartReminder(enabled: boolean): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!enabled) return;
  const perm = await Notifications.getPermissionsAsync();
  if (!perm.granted) {
    const req = await Notifications.requestPermissionsAsync();
    if (!req.granted) return;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('coach', { name: 'Coach reminders', importance: Notifications.AndroidImportance.DEFAULT });
  }
  const when = new Date();
  when.setHours(19, 0, 0, 0);
  if (when.getTime() < Date.now() + 60_000) when.setDate(when.getDate() + 1);
  const msg = await buildMessage();
  await Notifications.scheduleNotificationAsync({
    content: msg,
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when, channelId: 'coach' },
  });
}

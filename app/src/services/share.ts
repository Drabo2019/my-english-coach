import { Share } from 'react-native';

import { SHARE_MESSAGE } from '@/config';

/** Opens the system share sheet (WhatsApp, SMS, e-mail…) with the app description and the direct download link. */
export async function shareApp(): Promise<void> {
  try {
    await Share.share({ message: SHARE_MESSAGE });
  } catch {
    /* the person closed the sheet or sharing is unavailable */
  }
}

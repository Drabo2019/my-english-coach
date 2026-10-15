import { DEFAULT_UPDATE_REPO } from '@/services/storage/defaults';

/** Stable direct-download link: always the newest release (the release workflow publishes this fixed file name). */
export const APK_URL = `https://github.com/${DEFAULT_UPDATE_REPO}/releases/latest/download/my-english-coach.apk`;

export const SHARE_MESSAGE =
  `I’m using My English Coach, a free personal English coach with conversation, vocabulary and daily practice. ` +
  `Android app (free, no account): ${APK_URL}`;

/**
 * Optional WhatsApp number (digits only, with country code, no "+") that receives feedback directly.
 * Empty = the phone's share sheet opens and the person picks WhatsApp, e-mail, SMS…
 */
export const FEEDBACK_WHATSAPP = '';

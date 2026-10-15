export interface FeedbackDraft {
  version: string;
  device: string;
  screen: string;
  kind: string;
  note: string;
  contact?: string;
  level?: string;
}

/** Plain-text message that is sent through WhatsApp, e-mail or SMS. Pure, so it can be tested. */
export function buildFeedbackMessage(f: FeedbackDraft): string {
  const lines = [
    `My English Coach ${f.version} · ${f.device}`,
    `Screen: ${f.screen || 'general'}${f.level ? ` · Level: ${f.level}` : ''}`,
    `Type: ${f.kind}`,
  ];
  const note = f.note.trim();
  if (note) lines.push('', note);
  if (f.contact?.trim()) lines.push('', `Contact: ${f.contact.trim()}`);
  return lines.join('\n');
}

/** A feedback needs a type; a description is required for problems (otherwise we cannot act on it). */
export function validateFeedback(kind: string | null, note: string): string | null {
  if (!kind) return 'Choose what your feedback is about.';
  const needsNote = kind === 'Something is broken' || kind === 'This correction is wrong' || kind === 'Suggestion';
  if (needsNote && note.trim().length < 8) return 'Please describe it in a few words: what you did and what happened.';
  return null;
}

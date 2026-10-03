import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextProps, type TextInputProps, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useApp } from '@/features/app-context';
import { useTheme } from '@/hooks/use-theme';
import { tts } from '@/services/speech';

type Variant = 'title' | 'h2' | 'body' | 'small' | 'label';
const SIZE: Record<Variant, { fontSize: number; fontWeight?: '400' | '600' | '700'; lineHeight: number }> = {
  title: { fontSize: 26, fontWeight: '700', lineHeight: 32 },
  h2: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
  body: { fontSize: 16, lineHeight: 23 },
  small: { fontSize: 13, lineHeight: 18 },
  label: { fontSize: 12, fontWeight: '600', lineHeight: 16 },
};

export function T({ v = 'body', dim, color, style, ...p }: TextProps & { v?: Variant; dim?: boolean; color?: string }) {
  const th = useTheme();
  const { settings } = useApp();
  const s = SIZE[v];
  return (
    <Text
      {...p}
      style={[
        { color: color ?? (dim ? th.textSecondary : th.text), fontSize: s.fontSize * settings.fontScale, lineHeight: s.lineHeight * settings.fontScale, fontWeight: s.fontWeight },
        v === 'label' && { textTransform: 'uppercase', letterSpacing: 0.6 },
        style,
      ]}
    />
  );
}

export function Screen({ children, scroll = true, pad = true }: { children: React.ReactNode; scroll?: boolean; pad?: boolean }) {
  const th = useTheme();
  const insets = useSafeAreaInsets();
  const inner = { padding: pad ? 16 : 0, gap: 12, paddingBottom: 32 } as ViewStyle;
  return scroll ? (
    <ScrollView style={{ flex: 1, backgroundColor: th.background }} contentContainerStyle={inner} keyboardShouldPersistTaps="handled">
      {children}
    </ScrollView>
  ) : (
    <View style={[{ flex: 1, backgroundColor: th.background, paddingBottom: insets.bottom }, inner]}>{children}</View>
  );
}

export function Card({ children, style, onPress, tone }: { children: React.ReactNode; style?: ViewStyle; onPress?: () => void; tone?: 'good' | 'bad' | 'warn' | 'accent' }) {
  const th = useTheme();
  const bg = tone ? th[`${tone}Soft` as 'goodSoft'] : th.card;
  const body = (
    <View style={[{ backgroundColor: bg, borderColor: th.border, borderWidth: 1, borderRadius: 14, padding: 14, gap: 6 }, style]}>{children}</View>
  );
  return onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
      {body}
    </Pressable>
  ) : (
    body
  );
}

export function Btn({ label, onPress, kind = 'primary', disabled, small }: { label: string; onPress: () => void; kind?: 'primary' | 'ghost' | 'danger'; disabled?: boolean; small?: boolean }) {
  const th = useTheme();
  const bg = kind === 'primary' ? th.accent : kind === 'danger' ? th.bad : 'transparent';
  const fg = kind === 'ghost' ? th.accent : kind === 'danger' ? '#fff' : th.accentText;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: bg,
        borderColor: kind === 'ghost' ? th.border : bg,
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: small ? 8 : 13,
        paddingHorizontal: small ? 12 : 16,
        alignItems: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
        minHeight: small ? 36 : 48,
        justifyContent: 'center',
      })}>
      <T v={small ? 'small' : 'body'} color={fg} style={{ fontWeight: '600' }}>
        {label}
      </T>
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const th = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={{
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: active ? th.accent : th.card,
        borderColor: active ? th.accent : th.border,
        borderWidth: 1,
      }}>
      <T v="small" color={active ? th.accentText : th.text}>
        {label}
      </T>
    </Pressable>
  );
}

export const Row = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }, style]}>{children}</View>
);

export function Input(p: TextInputProps) {
  const th = useTheme();
  const { settings } = useApp();
  return (
    <TextInput
      placeholderTextColor={th.textSecondary}
      {...p}
      style={[
        { color: th.text, backgroundColor: th.card, borderColor: th.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16 * settings.fontScale, minHeight: 48 },
        p.style,
      ]}
    />
  );
}

/** Text field that keeps its own state while typing and persists on a short debounce / blur.
 *  (Persisting on every keystroke through an async store races and drops characters.) */
export function SavedInput({ value, onSave, ...p }: Omit<TextInputProps, 'value' | 'onChangeText'> & { value: string; onSave: (v: string) => void }) {
  const [local, setLocal] = React.useState(value);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = React.useRef(local);
  const flush = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    onSave(latest.current);
  };
  return (
    <Input
      {...p}
      value={local}
      onChangeText={(v) => {
        latest.current = v;
        setLocal(v);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(flush, 500);
      }}
      onBlur={flush}
    />
  );
}

export function Bar({ value, tone }: { value: number; tone?: 'accent' | 'good' }) {
  const th = useTheme();
  return (
    <View style={{ height: 8, borderRadius: 4, backgroundColor: th.border, overflow: 'hidden' }}>
      <View style={{ width: `${Math.max(0, Math.min(1, value)) * 100}%`, height: 8, backgroundColor: tone === 'good' ? th.good : th.accent }} />
    </View>
  );
}

/** Speaker button: normal and slow playback. */
export function Speak({ text, lang = 'en-US', label }: { text: string; lang?: 'en-US' | 'en-GB'; label?: string }) {
  const { settings } = useApp();
  return (
    <Row>
      <Btn small kind="ghost" label={label ?? '🔊 Listen'} onPress={() => tts.speak(text, { lang, rate: settings.ttsRate })} />
      <Btn small kind="ghost" label="🐢 Slow" onPress={() => tts.speak(text, { lang, rate: 0.55 })} />
    </Row>
  );
}

export function Tag({ label, tone }: { label: string; tone?: 'good' | 'warn' | 'bad' | 'accent' }) {
  const th = useTheme();
  const bg = tone ? th[`${tone}Soft` as 'goodSoft'] : th.border;
  const fg = tone ? th[tone] : th.textSecondary;
  return (
    <View style={{ backgroundColor: bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
      <T v="label" color={fg}>
        {label}
      </T>
    </View>
  );
}

/** "Give feedback on this screen" — feeds the REAL USER TEST loop. */
export function FeedbackLink({ screen }: { screen: string }) {
  return <Btn small kind="ghost" label="💬 Feedback on this screen" onPress={() => router.push({ pathname: '/feedback', params: { screen } })} />;
}

export const styles = StyleSheet.create({ flex: { flex: 1 } });

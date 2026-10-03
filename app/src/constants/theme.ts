export const Colors = {
  light: {
    text: '#14181F',
    textSecondary: '#5B6270',
    background: '#F6F7F9',
    card: '#FFFFFF',
    border: '#E3E6EB',
    accent: '#1F6FEB',
    accentText: '#FFFFFF',
    accentSoft: '#E6EFFD',
    good: '#1A7F45',
    goodSoft: '#E3F4EA',
    bad: '#C2312B',
    badSoft: '#FBE9E8',
    warn: '#9A6700',
    warnSoft: '#FFF4D6',
  },
  dark: {
    text: '#EEF1F6',
    textSecondary: '#9AA3B2',
    background: '#0E1116',
    card: '#171B22',
    border: '#272D38',
    accent: '#5B9BFF',
    accentText: '#0A0F18',
    accentSoft: '#172A47',
    good: '#4CC585',
    goodSoft: '#13291D',
    bad: '#FF7B72',
    badSoft: '#3A1B19',
    warn: '#E3B341',
    warnSoft: '#33290F',
  },
} as const;

export const highContrast = {
  light: { text: '#000000', textSecondary: '#222222', border: '#000000', card: '#FFFFFF', background: '#FFFFFF' },
  dark: { text: '#FFFFFF', textSecondary: '#E0E0E0', border: '#FFFFFF', card: '#000000', background: '#000000' },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };

export const Spacing = { one: 4, two: 8, three: 16, four: 24, five: 32 } as const;

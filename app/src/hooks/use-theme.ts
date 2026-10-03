import { Colors, highContrast, type ThemeColors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useApp } from '@/features/app-context';

export function useTheme(): ThemeColors {
  const scheme = useColorScheme();
  const { settings } = useApp();
  const mode = scheme === 'dark' ? 'dark' : 'light';
  return settings.highContrast ? { ...Colors[mode], ...highContrast[mode] } : Colors[mode];
}

import { useEffect } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useSettingsStore } from '@/lib/store/settingsStore';

export const useTheme = () => {
  const { settings } = useSettingsStore();

  const setTheme = (themeMode: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', themeMode);
    localStorage.setItem('theme', themeMode);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(settings.theme);
    }
  }, [settings.theme]);

  return {
    theme: settings.theme,
    setTheme,
    algorithm: settings.theme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  };
}; 
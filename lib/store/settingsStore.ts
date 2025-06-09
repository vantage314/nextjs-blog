import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  nickname: string;
  email: string;
  avatar?: string;
}

export interface SystemSettings {
  language: 'zh_CN' | 'en_US';
  theme: 'light' | 'dark';
  notifications: {
    enabled: boolean;
    sound: boolean;
    email: boolean;
  };
}

interface SettingsState {
  profile: UserProfile;
  settings: SystemSettings;
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<SystemSettings>) => void;
  resetSettings: () => void;
}

const defaultProfile: UserProfile = {
  nickname: '',
  email: '',
};

const defaultSettings: SystemSettings = {
  language: 'zh_CN',
  theme: 'light',
  notifications: {
    enabled: true,
    sound: true,
    email: true,
  },
};

// 自定义存储实现
const storage = createJSONStorage(() => ({
  getItem: (name: string) => {
    const str = localStorage.getItem(name);
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
}));

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      settings: defaultSettings,
      
      updateProfile: (profile) => set((state) => ({
        profile: { ...state.profile, ...profile },
      })),
      
      updateSettings: (settings) => set((state) => ({
        settings: {
          ...state.settings,
          ...settings,
          notifications: {
            ...state.settings.notifications,
            ...(settings.notifications || {}),
          },
        },
      })),
      
      resetSettings: () => set({
        profile: defaultProfile,
        settings: defaultSettings,
      }),
    }),
    {
      name: 'settings-storage',
      storage,
      partialize: (state) => ({
        profile: state.profile,
        settings: state.settings,
      }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // 状态恢复后的回调
        if (state) {
          // 应用主题
          document.documentElement.setAttribute('data-theme', state.settings.theme);
        }
      },
    }
  )
); 
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeColors {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
}

interface ThemeState {
    colors: ThemeColors;
    setColors: (colors: Partial<ThemeColors>) => void;
    resetToDefaults: () => void;
}

export const DEFAULT_THEME_COLORS: ThemeColors = {
    primary: '#1f2937',   // Gray 800
    secondary: '#fde047', // Yellow 300
    tertiary: '#374151',  // Gray 700
    quaternary: '#2563eb', // Gray 600
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            colors: { ...DEFAULT_THEME_COLORS },
            setColors: (newColors) =>
                set((state) => ({
                    colors: { ...state.colors, ...newColors },
                })),
            resetToDefaults: () => set({ colors: { ...DEFAULT_THEME_COLORS } }),
        }),
        {
            name: 'nexus-theme-storage',
        }
    )
);

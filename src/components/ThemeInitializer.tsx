import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export const ThemeInitializer = () => {
    const colors = useThemeStore((state) => state.colors);

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--nexus-primary', colors.primary);
        root.style.setProperty('--nexus-secondary', colors.secondary);
        root.style.setProperty('--nexus-tertiary', colors.tertiary);
        
    }, [colors]);

    return null;
};

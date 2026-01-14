'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const STORAGE_KEY = 'opensphere-theme';

const ThemeContext = createContext(null);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

export function ThemeProvider({ children }) {
    const [theme, setThemeState] = useState('dark');
    const [isLoaded, setIsLoaded] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored);
        }
        setIsLoaded(true);
    }, []);

    // Apply theme to document
    useEffect(() => {
        if (!isLoaded) return;

        const root = document.documentElement;
        root.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme, isLoaded]);

    const setTheme = useCallback((newTheme) => {
        setThemeState(newTheme);
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    const isDark = theme === 'dark';
    const isLight = theme === 'light';

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark, isLight, isLoaded }}>
            {children}
        </ThemeContext.Provider>
    );
}

// Standalone hook for components that don't need provider
export function useThemeState() {
    const [theme, setThemeState] = useState('dark');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark') {
            setThemeState(stored);
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme, isLoaded]);

    const toggleTheme = useCallback(() => {
        setThemeState(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    return { theme, setTheme: setThemeState, toggleTheme, isDark: theme === 'dark', isLoaded };
}

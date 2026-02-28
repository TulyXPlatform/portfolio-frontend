import React, { createContext, useContext, useState, useEffect } from 'react';

export type SeasonTheme = 'dark' | 'light';

interface ThemeContextType {
    theme: SeasonTheme;
    setTheme: (theme: SeasonTheme) => void;
    weatherMsg: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setThemeState] = useState<SeasonTheme>('dark');
    const [weatherMsg, setWeatherMsg] = useState('Happy to see you!');

    const setTheme = (t: SeasonTheme) => {
        setThemeState(t);
        updateWeatherMsg(t);
    };

    const updateWeatherMsg = (t: SeasonTheme) => {
        const msgs: Record<SeasonTheme, string> = {
            dark: "Oh! it seems- nice outside. Have a nice day.",
            light: "Oh! it seems- nice outside. Have a nice day."
        };
        setWeatherMsg(msgs[t]);
    };

    useEffect(() => {
        // Disabled auto weather check to keep the un-pulled theme strictly default.
    }, []);

    useEffect(() => {
        document.body.className = theme;
        updateWeatherMsg(theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, weatherMsg }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};

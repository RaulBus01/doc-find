import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';

type ThemeContextType = {
  theme: any;
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: Colors.light,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() ?? 'light';
  const [manualTheme, setManualTheme] = useState<'light' | 'dark' | null>(null);
  
  const colorScheme = manualTheme || systemColorScheme;
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  
  const toggleTheme = () => {
    setManualTheme(prev => prev === 'dark' || (prev === null && systemColorScheme === 'dark') ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
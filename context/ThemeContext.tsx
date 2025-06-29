import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Colors, ThemeColors } from '@/constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_PREFERENCE_KEY = 'userThemePreference';

type ThemeContextType = {
  theme: ThemeColors
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
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setManualTheme(savedTheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadThemePreference();
  }, []);
  
  const colorScheme = manualTheme || systemColorScheme;
  const theme = Colors[colorScheme];
  const isDark = colorScheme === 'dark';
  
  const toggleTheme = async () => {

    const newTheme = isDark ? 'light' : 'dark';

    setManualTheme(newTheme);
    
 
    try {
      await AsyncStorage.setItem(THEME_PREFERENCE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };


  if (isLoading) {

    return (
      <ThemeContext.Provider value={{ theme: Colors[systemColorScheme], isDark: systemColorScheme === 'dark', toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
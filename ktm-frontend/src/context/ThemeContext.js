import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';

export const THEMES = {
  'KTM Dark Mode': {
    background: '#120F0E',
    surface: '#1C1614',
    card: '#261D1A',
    primary: '#FF6600',
    secondary: '#A89F91',
    text: '#FFFFFF',
    textSecondary: '#A89F91',
    border: '#3D312D',
    success: '#4CAF50',
    error: '#F44336',
    accent: '#FFD700',
  },
  'Husqvarna Blue': {
    background: '#0A0F14',
    surface: '#101820',
    card: '#182430',
    primary: '#00458C',
    secondary: '#FFE600',
    text: '#FFFFFF',
    textSecondary: '#A89F91',
    border: '#1B2C3D',
    success: '#4CAF50',
    error: '#F44336',
    accent: '#FFE600',
  },
  'GasGas Red': {
    background: '#140A0A',
    surface: '#1F1010',
    card: '#2C1818',
    primary: '#E30613',
    secondary: '#A89F91',
    text: '#FFFFFF',
    textSecondary: '#A89F91',
    border: '#451D1D',
    success: '#4CAF50',
    error: '#F44336',
    accent: '#FFD700',
  },
  'Beast Edition': {
    background: '#0B0B0B',
    surface: '#141414',
    card: '#1E1E1E',
    primary: '#E6E6E6',
    secondary: '#888888',
    text: '#FFFFFF',
    textSecondary: '#888888',
    border: '#2A2A2A',
    success: '#4CAF50',
    error: '#F44336',
    accent: '#FFD700',
  },
  'Grand Prix White': {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    card: '#EBEBEB',
    primary: '#FF6600',
    secondary: '#666666',
    text: '#120F0E',
    textSecondary: '#666666',
    border: '#CCCCCC',
    success: '#27C96E',
    error: '#FF3B30',
    accent: '#FFD700',
  }
};

export const ThemeContext = createContext();

// Helper to mutate the global Colors object directly so that any statically referenced values
// evaluate correctly when screens render.
const applyThemeToGlobalColors = (themeName) => {
  const theme = THEMES[themeName];
  if (theme) {
    Object.keys(theme).forEach((key) => {
      Colors[key] = theme[key];
    });
  }
};

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('KTM Dark Mode');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem('ktm_theme');
        if (storedTheme && THEMES[storedTheme]) {
          setThemeName(storedTheme);
          applyThemeToGlobalColors(storedTheme);
        }
      } catch (e) {
        console.error('[THEME] Error loading stored theme:', e);
      }
    };
    loadTheme();
  }, []);

  const changeTheme = async (name) => {
    if (THEMES[name]) {
      setThemeName(name);
      applyThemeToGlobalColors(name);
      await AsyncStorage.setItem('ktm_theme', name);
    }
  };

  const colors = THEMES[themeName];

  return (
    <ThemeContext.Provider value={{ themeName, colors, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

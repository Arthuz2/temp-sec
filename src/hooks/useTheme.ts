import { useSettings } from '../contexts/SettingsContext';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    surfaceVariant: string;
    text: string;
    textSecondary: string;
    border: string;
    primary: string;
    primaryVariant: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    card: string;
    cardShadow: string;
  };
}

export function useTheme(): Theme {
  const { darkMode } = useSettings();

  return {
    colors: {
      background: darkMode ? '#121212' : '#f8f9fa',
      surface: darkMode ? '#1e1e1e' : '#ffffff',
      surfaceVariant: darkMode ? '#2a2a2a' : '#f5f5f5',
      text: darkMode ? '#ffffff' : '#000000',
      textSecondary: darkMode ? '#b3b3b3' : '#666666',
      border: darkMode ? '#333333' : '#e0e0e0',
      primary: darkMode ? '#667eea' : '#5a67d8',
      primaryVariant: darkMode ? '#764ba2' : '#4c51bf',
      secondary: darkMode ? '#4ECDC4' : '#38b2ac',
      success: darkMode ? '#48bb78' : '#38a169',
      warning: darkMode ? '#ed8936' : '#dd6b20',
      error: darkMode ? '#f56565' : '#e53e3e',
      card: darkMode ? '#1e1e1e' : '#ffffff',
      cardShadow: darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)',
    },
  };
}

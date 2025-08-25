import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TemperatureLimits {
  min: number;
  max: number;
  ideal: {
    min: number;
    max: number;
  };
}

interface NotificationSettings {
  sound: boolean;
  vibration: boolean;
  popup: boolean;
}

interface SettingsContextData {
  temperatureLimits: TemperatureLimits;
  temperatureUnit: '°C' | '°F';
  readingInterval: number;
  sessionDuration: number;
  darkMode: boolean;
  notificationSettings: NotificationSettings;
  updateTemperatureLimits: (limits: TemperatureLimits) => void;
  updateTemperatureUnit: (unit: '°C' | '°F') => void;
  updateReadingInterval: (interval: number) => void;
  updateSessionDuration: (duration: number) => void;
  toggleDarkMode: () => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
}

const SettingsContext = createContext<SettingsContextData | undefined>(undefined);

const STORAGE_KEYS = {
  TEMPERATURE_LIMITS: '@settings:temperatureLimits',
  TEMPERATURE_UNIT: '@settings:temperatureUnit',
  READING_INTERVAL: '@settings:readingInterval',
  SESSION_DURATION: '@settings:sessionDuration',
  DARK_MODE: '@settings:darkMode',
  NOTIFICATION_SETTINGS: '@settings:notificationSettings',
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [temperatureLimits, setTemperatureLimits] = useState<TemperatureLimits>({
    min: 160,
    max: 250,
    ideal: {
      min: 180,
      max: 240
    }
  });

  const [temperatureUnit, setTemperatureUnit] = useState<'°C' | '°F'>('°C');
  const [readingInterval, setReadingInterval] = useState(30000);
  const [sessionDuration, setSessionDuration] = useState(180);
  const [darkMode, setDarkMode] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    sound: true,
    vibration: true,
    popup: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [limits, unit, interval, duration, dark, notifications] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.TEMPERATURE_LIMITS),
        AsyncStorage.getItem(STORAGE_KEYS.TEMPERATURE_UNIT),
        AsyncStorage.getItem(STORAGE_KEYS.READING_INTERVAL),
        AsyncStorage.getItem(STORAGE_KEYS.SESSION_DURATION),
        AsyncStorage.getItem(STORAGE_KEYS.DARK_MODE),
        AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS),
      ]);

      if (limits) setTemperatureLimits(JSON.parse(limits));
      if (unit) setTemperatureUnit(unit as '°C' | '°F');
      if (interval) setReadingInterval(parseInt(interval));
      if (duration) setSessionDuration(parseInt(duration));
      if (dark) setDarkMode(JSON.parse(dark));
      if (notifications) setNotificationSettings(JSON.parse(notifications));
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const updateTemperatureLimits = async (limits: TemperatureLimits) => {
    setTemperatureLimits(limits);
    await AsyncStorage.setItem(STORAGE_KEYS.TEMPERATURE_LIMITS, JSON.stringify(limits));
  };

  const updateTemperatureUnit = async (unit: '°C' | '°F') => {
    setTemperatureUnit(unit);
    await AsyncStorage.setItem(STORAGE_KEYS.TEMPERATURE_UNIT, unit);
  };

  const updateReadingInterval = async (interval: number) => {
    setReadingInterval(interval);
    await AsyncStorage.setItem(STORAGE_KEYS.READING_INTERVAL, interval.toString());
  };

  const updateSessionDuration = async (duration: number) => {
    setSessionDuration(duration);
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_DURATION, duration.toString());
  };

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    await AsyncStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(newMode));
  };

  const updateNotificationSettings = async (settings: NotificationSettings) => {
    setNotificationSettings(settings);
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
  };

  return (
    <SettingsContext.Provider
      value={{
        temperatureLimits,
        temperatureUnit,
        readingInterval,
        sessionDuration,
        darkMode,
        notificationSettings,
        updateTemperatureLimits,
        updateTemperatureUnit,
        updateReadingInterval,
        updateSessionDuration,
        toggleDarkMode,
        updateNotificationSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
}
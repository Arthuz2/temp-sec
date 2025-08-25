import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import { getLastTemperature } from '../api/getLastTemperature';
import { useSettings } from './SettingsContext';

interface Temperature {
  data: string;
  valor: number;
}

interface NotificationContextType {
  lastNotifiedTemp: Temperature | null;
  isBackgroundTaskRegistered: boolean;
  registerBackgroundTask: () => Promise<void>;
  checkForNewTemperature: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const BACKGROUND_TASK_NAME = 'temperature-background-task';
const LAST_NOTIFIED_TEMP_KEY = 'lastNotifiedTemperature';

const saveAlertToHistory = async (temperature: Temperature, type: "high" | "low" | "normal", message: string) => {
  try {
    if (type !== "high" && type !== "low") {
      return;
    }

    const existingHistory = await AsyncStorage.getItem("alertHistory");
    const history = existingHistory ? JSON.parse(existingHistory) : [];

    const newAlert = {
      id: `${Date.now()}_${Math.random()}`,
      timestamp: temperature.data,
      temperature: temperature.valor,
      type,
      message,
    };

    const updatedHistory = [newAlert, ...history].slice(0, 100);
    await AsyncStorage.setItem("alertHistory", JSON.stringify(updatedHistory));

  } catch (error) {
    console.error("Erro ao salvar alerta no histórico:", error);
  }
};

const sendLocalNotificationInBackground = async (temperature: Temperature, temperatureLimits: any, notificationSettings: any) => {
  const temperatureValue = temperature.valor;
  const timeAgo = new Date(temperature.data).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let icon = "🌡️";
  let priority = Notifications.AndroidNotificationPriority.DEFAULT;
  let type: "high" | "low" | "normal" = "normal";
  let channelId = "temperature-alerts";
  let message = `Temperatura registrada: ${temperatureValue}°C às ${timeAgo}`;

  if (temperatureValue >= temperatureLimits.max) {
    icon = "🔥";
    priority = Notifications.AndroidNotificationPriority.MAX;
    type = "high";
    channelId = "critical-alerts";
    message = `ALERTA: Temperatura muito alta! ${temperatureValue}°C registrados às ${timeAgo} (Limite: ${temperatureLimits.max}°C)`;
  } else if (temperatureValue <= temperatureLimits.min) {
    icon = "❄️";
    priority = Notifications.AndroidNotificationPriority.MAX;
    type = "low";
    channelId = "critical-alerts";
    message = `ALERTA: Temperatura muito baixa! ${temperatureValue}°C registrados às ${timeAgo} (Limite: ${temperatureLimits.min}°C)`;
  } else if (
    temperatureValue >= temperatureLimits.ideal.min &&
    temperatureValue <= temperatureLimits.ideal.max
  ) {
    icon = "☀️";
    message = `Temperatura ideal: ${temperatureValue}°C às ${timeAgo}`;
  }

  await saveAlertToHistory(temperature, type, message);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${icon} Nova Temperatura Registrada`,
      body: message,
      data: {
        temperature: temperatureValue,
        timestamp: temperature.data,
        type: "new_temperature",
        isCritical: type === "high" || type === "low",
      },
      sound: notificationSettings.sound ? "default" : false,
      badge: 1,
    },
    trigger: null,
    identifier: `temp_${Date.now()}`,
  });
};

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  const { temperatureLimits } = useSettings();
  try {
    const currentTemp = await getLastTemperature();
    const lastNotifiedTempStr = await AsyncStorage.getItem(LAST_NOTIFIED_TEMP_KEY);
    const lastNotifiedTemp = lastNotifiedTempStr ? JSON.parse(lastNotifiedTempStr) : null;

    if (!lastNotifiedTemp || new Date(currentTemp.data).getTime() !== new Date(lastNotifiedTemp.data).getTime()) {
      const storedLimits = await AsyncStorage.getItem('@settings:temperatureLimits');
      const storedNotificationSettings = await AsyncStorage.getItem('@settings:notificationSettings');

      const currentLimits = storedLimits ? JSON.parse(storedLimits) : {
        min: temperatureLimits.min, max: temperatureLimits.max, ideal: { min: temperatureLimits.ideal.min, max: temperatureLimits.ideal.max }
      };

      const currentNotificationSettings = storedNotificationSettings ? JSON.parse(storedNotificationSettings) : {
        sound: true, vibration: true, popup: true
      };

      await sendLocalNotificationInBackground(currentTemp, currentLimits, currentNotificationSettings);

      await AsyncStorage.setItem(LAST_NOTIFIED_TEMP_KEY, JSON.stringify(currentTemp));
    }

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Erro na tarefa em background:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [lastNotifiedTemp, setLastNotifiedTemp] = useState<Temperature | null>(null);
  const [isBackgroundTaskRegistered, setIsBackgroundTaskRegistered] = useState(false);

  useEffect(() => {
    const initializeNotifications = async () => {
      await loadLastNotifiedTemp();
      await checkBackgroundTaskStatus();
      await registerBackgroundTask();
    };

    initializeNotifications();
  }, []);

  const loadLastNotifiedTemp = async () => {
    try {
      const stored = await AsyncStorage.getItem(LAST_NOTIFIED_TEMP_KEY);
      if (stored) {
        setLastNotifiedTemp(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar última temperatura notificada:', error);
    }
  };

  const checkBackgroundTaskStatus = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);
      setIsBackgroundTaskRegistered(isRegistered);
    } catch (error) {
      console.error('Erro ao verificar status da tarefa em background:', error);
    }
  };

  const registerBackgroundTask = async () => {
    try {
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_NAME);

      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
          minimumInterval: 15000,
          stopOnTerminate: false,
          startOnBoot: true,
        });

        setIsBackgroundTaskRegistered(true);
      } else {
        setIsBackgroundTaskRegistered(true);
      }
    } catch (error) {
      console.error('Erro ao registrar tarefa em background:', error);
    }
  };

  const sendNotificationWithCurrentLimits = async (currentTemp: Temperature, currentLimits: any, currentNotificationSettings: any) => {
    if (currentNotificationSettings.popup) {
      let notificationMessage = `Temperatura atual: ${currentTemp.valor}°C.`;

      if (currentTemp.valor < currentLimits.min) {
        notificationMessage = `Alerta: Temperatura muito baixa! ${notificationMessage}`;
      } else if (currentTemp.valor > currentLimits.max) {
        notificationMessage = `Alerta: Temperatura muito alta! ${notificationMessage}`;
      } else if (currentTemp.valor < currentLimits.ideal.min) {
        notificationMessage = `Atenção: Temperatura abaixo do ideal. ${notificationMessage}`;
      } else if (currentTemp.valor > currentLimits.ideal.max) {
        notificationMessage = `Atenção: Temperatura acima do ideal. ${notificationMessage}`;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Alerta de Temperatura',
          body: notificationMessage,
          sound: currentNotificationSettings.sound ? 'default' : false,
          badge: 1,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null,
      });

    }
  };

  const checkForNewTemperature = async () => {
    try {
      const currentTemp = await getLastTemperature();
      console.log('Verificando nova temperatura:', currentTemp.valor + '°C');

      if (!lastNotifiedTemp || new Date(currentTemp.data).getTime() !== new Date(lastNotifiedTemp.data).getTime()) {
        const timeDifference = lastNotifiedTemp
          ? new Date(currentTemp.data).getTime() - new Date(lastNotifiedTemp.data).getTime()
          : Infinity;

        const cooldown = 10000;
        if (timeDifference >= cooldown) {

          const storedLimits = await AsyncStorage.getItem('@settings:temperatureLimits');
          const storedNotificationSettings = await AsyncStorage.getItem('@settings:notificationSettings');

          const currentLimits = storedLimits ? JSON.parse(storedLimits) : {
            min: 15, max: 45, ideal: { min: 35, max: 40 }
          };
          const currentNotificationSettings = storedNotificationSettings ? JSON.parse(storedNotificationSettings) : {
            sound: true, vibration: true, popup: true
          };

          await sendLocalNotificationInBackground(currentTemp, currentLimits, currentNotificationSettings);

          setLastNotifiedTemp(currentTemp);
          await AsyncStorage.setItem(LAST_NOTIFIED_TEMP_KEY, JSON.stringify(currentTemp));
        }
      }
    } catch (error) {
      console.error('Erro ao verificar nova temperatura:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        lastNotifiedTemp,
        isBackgroundTaskRegistered,
        registerBackgroundTask,
        checkForNewTemperature,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext deve ser usado dentro de NotificationProvider');
  }
  return context;
}

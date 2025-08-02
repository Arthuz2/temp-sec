
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { useNotifications } from '../hooks/useNotifications';
import { getLastTemperature } from '../api/getLastTemperature';

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

const BACKGROUND_FETCH_TASK = 'temperature-background-fetch';
const LAST_NOTIFIED_TEMP_KEY = 'lastNotifiedTemperature';

// Definir a tarefa em background
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const currentTemp = await getLastTemperature();
    const lastNotifiedTempStr = await AsyncStorage.getItem(LAST_NOTIFIED_TEMP_KEY);
    const lastNotifiedTemp = lastNotifiedTempStr ? JSON.parse(lastNotifiedTempStr) : null;

    // Verificar se é uma nova temperatura
    if (!lastNotifiedTemp || new Date(currentTemp.data).getTime() !== new Date(lastNotifiedTemp.data).getTime()) {
      // Enviar notificação
      const { sendLocalNotification } = require('../hooks/useNotifications');
      const notificationHook = { sendLocalNotification };
      await notificationHook.sendLocalNotification(currentTemp);

      // Salvar a nova temperatura como última notificada
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
  const { sendLocalNotification } = useNotifications();

  useEffect(() => {
    loadLastNotifiedTemp();
    checkBackgroundTaskStatus();
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
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
      setIsBackgroundTaskRegistered(isRegistered);
    } catch (error) {
      console.error('Erro ao verificar status da tarefa em background:', error);
    }
  };

  const registerBackgroundTask = async () => {
    try {
      // Verificar se já está registrada
      const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);

      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 30, // 30 segundos mínimo
          stopOnTerminate: false,
          startOnBoot: true,
        });

        setIsBackgroundTaskRegistered(true);
        console.log('Tarefa em background registrada com sucesso');
      }
    } catch (error) {
      console.error('Erro ao registrar tarefa em background:', error);
    }
  };

  const checkForNewTemperature = async () => {
    try {
      const currentTemp = await getLastTemperature();

      // Verificar se é uma nova temperatura e se não foi notificada recentemente
      const currentTempTime = new Date(currentTemp.data).getTime();
      const lastNotifiedTime = lastNotifiedTemp ? new Date(lastNotifiedTemp.data).getTime() : 0;

      // Adicionar debounce de 5 segundos para evitar notificações duplicadas
      const timeDifference = currentTempTime - lastNotifiedTime;

      if (timeDifference > 5000) { // 5 segundos de diferença mínima
        await sendLocalNotification(currentTemp);
        setLastNotifiedTemp(currentTemp);
        await AsyncStorage.setItem(LAST_NOTIFIED_TEMP_KEY, JSON.stringify(currentTemp));
        console.log('Nova notificação enviada:', currentTemp.valor + '°C');
      } else {
        console.log('Notificação ignorada (muito recente):', timeDifference + 'ms');
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

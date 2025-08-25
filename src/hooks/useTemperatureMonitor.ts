import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getLastTemperature } from '../api/getLastTemperature';
import { getAllTemperature } from '../api/getAllTemperature';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useSettings } from '../contexts/SettingsContext';
import { useNotifications } from './useNotifications';

interface Temperature {
  data: string;
  valor: number;
}

export function useTemperatureMonitor() {
  const { checkForNewTemperature, registerBackgroundTask, isBackgroundTaskRegistered } = useNotificationContext();
  const { sendLocalNotification } = useNotifications();
  const { readingInterval } = useSettings();
  const appState = useRef(AppState.currentState);
  const lastNotificationTime = useRef<string | null>(null);

  const { data: currentTemp, refetch, error: currentTempError } = useQuery<Temperature>({
    queryKey: ['temperatureMonitor'],
    queryFn: getLastTemperature,
    refetchInterval: readingInterval,
    refetchIntervalInBackground: true,
    enabled: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: allTemperatures, refetch: refetchAllTemperatures, error: allTempError } = useQuery<Temperature[]>({
    queryKey: ['allTemperatures'],
    queryFn: getAllTemperature,
    refetchInterval: readingInterval * 2,
    enabled: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

   
  useEffect(() => {
    if (currentTempError) {
      console.error('Erro ao buscar temperatura atual:', currentTempError);
    }
    if (allTempError) {
      console.error('Erro ao buscar histórico:', allTempError);
    }
  }, [currentTempError, allTempError]);

  useEffect(() => {
    if (!isBackgroundTaskRegistered) {
      registerBackgroundTask();
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isBackgroundTaskRegistered]);

  useEffect(() => {
    if (currentTemp && currentTemp.data !== lastNotificationTime.current) {
      lastNotificationTime.current = currentTemp.data;
      checkForNewTemperature();
    }
  }, [currentTemp]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      refetch();
      refetchAllTemperatures();
    }
    appState.current = nextAppState;
  };

  const refetchAll = () => {
    refetch();
    refetchAllTemperatures();
  };

  return {
    currentTemp,
    allTemperatures,
    refetch: refetchAll,
    isError: !!currentTempError || !!allTempError,
    error: currentTempError || allTempError,
  };
}
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getLastTemperature } from '../api/getLastTemperature';
import { getAllTemperature } from '../api/getAllTemperature';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useSettings } from '../contexts/SettingsContext';

interface Temperature {
  data: string;
  valor: number;
}

export function useTemperatureMonitor() {
  const { checkForNewTemperature, registerBackgroundTask, isBackgroundTaskRegistered } = useNotificationContext();
  const { readingInterval } = useSettings();
  const appState = useRef(AppState.currentState);
  const lastNotificationTime = useRef<string | null>(null);

  // Query para monitorar temperatura em tempo real
  const { data: currentTemp, refetch } = useQuery<Temperature>({
    queryKey: ['temperatureMonitor'],
    queryFn: getLastTemperature,
    refetchInterval: readingInterval, // 30 segundos
    refetchIntervalInBackground: true,
    enabled: true,
  });

  // Query para obter histórico completo
  const { data: allTemperatures, refetch: refetchAllTemperatures } = useQuery<Temperature[]>({
    queryKey: ['allTemperatures'],
    queryFn: getAllTemperature,
    refetchInterval: readingInterval * 2, // 1 minuto
    enabled: true,
  });

  useEffect(() => {
    // Registrar tarefa em background na primeira execução
    if (!isBackgroundTaskRegistered) {
      registerBackgroundTask();
    }

    // Monitorar mudanças no estado do app
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [isBackgroundTaskRegistered]);

  useEffect(() => {
    // Verificar nova temperatura apenas se for diferente da última notificação
    if (currentTemp && currentTemp.data !== lastNotificationTime.current) {
      lastNotificationTime.current = currentTemp.data;
      checkForNewTemperature();
    }
  }, [currentTemp]);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App voltou para foreground - apenas refetch, não verificar notificação
      console.log('App voltou para foreground - atualizando dados');
      refetch();
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
  };
}
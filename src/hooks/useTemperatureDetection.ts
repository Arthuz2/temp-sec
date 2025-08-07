import { useEffect, useRef } from 'react';
import { useNotifications } from './useNotifications';
import { useToast } from './useToast';
import { useSettings } from '../contexts/SettingsContext';

interface Temperature {
  valor: number;
  data: string;
}

interface TemperatureStatus {
  status: 'baixa' | 'ideal' | 'alta' | 'muito_baixa' | 'muito_alta';
  color: string;
  message: string;
}

export function useTemperatureDetection(currentTemp?: Temperature) {
  const { sendLocalNotification } = useNotifications();
  const { showToast } = useToast();
  const previousTempRef = useRef<Temperature | null>(null);
  const lastNotificationRef = useRef<string>('');
  const { temperatureLimits, temperatureUnit } = useSettings();

  useEffect(() => {
    if (currentTemp && previousTempRef.current) {
      const currentTime = new Date(currentTemp.data).getTime();
      const previousTime = new Date(previousTempRef.current.data).getTime();

      // Verificar se é uma nova temperatura
      if (currentTime !== previousTime && currentTemp.data !== lastNotificationRef.current) {
        handleNewTemperature(currentTemp);
      }
    }

    previousTempRef.current = currentTemp || null;
  }, [currentTemp]);

  const handleNewTemperature = async (temperature: Temperature) => {
    try {
      // Evitar notificações duplicadas
      if (lastNotificationRef.current === temperature.data) {
        return;
      }

      lastNotificationRef.current = temperature.data;

      await sendLocalNotification(temperature);

      const temperatureStatus = getTemperatureStatus(temperature);
      let message = temperatureStatus.message;
      let type: "success" | "warning" | "error" = "success";

      if (temperatureStatus.status === 'muito_alta') {
        type = "error";
      } else if (temperatureStatus.status === 'muito_baixa') {
        type = "warning";
      } else if (temperatureStatus.status === 'alta') {
        type = "error";
      } else if (temperatureStatus.status === 'baixa') {
        type = "warning";
      } else {
        type = "success";
      }

      // Mostrar toast apenas se não for uma temperatura extrema (para evitar spam)
      if (temperatureStatus.status !== 'muito_alta' && temperatureStatus.status !== 'muito_baixa') {
        showToast(message, type);
      }

      console.log('Nova temperatura detectada:', temperature.valor + '°C');
    } catch (error) {
      console.error('Erro ao processar nova temperatura:', error);
    }
  };

  const getTemperatureStatus = (temperature: Temperature): TemperatureStatus => {
    const temp = temperature.valor;
    const { min, max, ideal } = temperatureLimits;

    const convertTemp = (temp: number) => temperatureUnit === '°F' ? (temp * 9 / 5) + 32 : temp;
    const displayTemp = convertTemp(temp);
    const displayMin = convertTemp(min);
    const displayMax = convertTemp(max);

    if (temp <= min) {
      return {
        status: 'muito_baixa',
        color: '#3742fa',
        message: `Temperatura muito baixa! ${displayTemp.toFixed(1)}${temperatureUnit} (abaixo de ${displayMin.toFixed(1)}${temperatureUnit})`
      };
    } else if (temp < ideal.min) {
      return {
        status: 'baixa',
        color: '#70a1ff',
        message: `Temperatura baixa: ${displayTemp.toFixed(1)}${temperatureUnit}`
      };
    } else if (temp >= ideal.min && temp <= ideal.max) {
      return {
        status: 'ideal',
        color: '#2ed573',
        message: `Temperatura ideal: ${displayTemp.toFixed(1)}${temperatureUnit}`
      };
    } else if (temp < max) {
      return {
        status: 'alta',
        color: '#ffa502',
        message: `Temperatura alta: ${displayTemp.toFixed(1)}${temperatureUnit}`
      };
    } else {
      return {
        status: 'muito_alta',
        color: '#ff4757',
        message: `Temperatura muito alta! ${displayTemp.toFixed(1)}${temperatureUnit} (acima de ${displayMax.toFixed(1)}${temperatureUnit})`
      };
    }
  };

  return {
    handleNewTemperature,
    getTemperatureStatus,
  };
}
import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSettings } from "../contexts/SettingsContext";

interface Temperature {
  data: string;
  valor: number;
}

interface NotificationAlert {
  id: string;
  timestamp: string;
  temperature: number;
  type: 'high' | 'low' | 'normal';
  message: string;
}

// Configurar o comportamento das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const { notificationSettings, temperatureLimits } = useSettings();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const saveAlertToHistory = async (temperature: Temperature, type: 'high' | 'low' | 'normal', message: string) => {
    try {
      const existingHistory = await AsyncStorage.getItem('alertHistory');
      const history: NotificationAlert[] = existingHistory ? JSON.parse(existingHistory) : [];

      const newAlert: NotificationAlert = {
        id: `${Date.now()}_${Math.random()}`,
        timestamp: temperature.data,
        temperature: temperature.valor,
        type,
        message
      };

      // Adicionar no início da lista e manter apenas os últimos 100
      const updatedHistory = [newAlert, ...history].slice(0, 100);
      await AsyncStorage.setItem('alertHistory', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('Erro ao salvar alerta no histórico:', error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const sendLocalNotification = async (temperature: Temperature) => {
    const temperatureValue = temperature.valor;
    const timeAgo = new Date(temperature.data).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let icon = "🌡️";
    let priority = Notifications.AndroidNotificationPriority.DEFAULT;
    let type: 'high' | 'low' | 'normal' = 'normal';
    let message = `Temperatura registrada: ${temperatureValue}°C às ${timeAgo}`;
    console.log('Enviando notificação local:', message);
    console.log('Limites atuais:', temperatureLimits);

    if (temperatureValue >= temperatureLimits.max) {
      icon = "🔥";
      priority = Notifications.AndroidNotificationPriority.HIGH;
      type = 'high';
      message = `ALERTA: Temperatura muito alta! ${temperatureValue}°C registrados às ${timeAgo} (Limite: ${temperatureLimits.max}°C)`;
    } else if (temperatureValue <= temperatureLimits.min) {
      icon = "❄️";
      priority = Notifications.AndroidNotificationPriority.HIGH;
      type = 'low';
      message = `ALERTA: Temperatura muito baixa! ${temperatureValue}°C registrados às ${timeAgo} (Limite: ${temperatureLimits.min}°C)`;
    } else if (temperatureValue >= temperatureLimits.ideal.min && temperatureValue <= temperatureLimits.ideal.max) {
      icon = "☀️";
      message = `Temperatura ideal: ${temperatureValue}°C às ${timeAgo}`;
    } else {
      icon = "🌤️";
      message = `Temperatura registrada: ${temperatureValue}°C às ${timeAgo}`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${icon} Nova Temperatura Registrada`,
        body: message,
        data: {
          temperature: temperatureValue,
          timestamp: temperature.data,
          type: "new_temperature",
        },
        sound: notificationSettings.sound ? "default" : false,
      },
      trigger: null, // Enviar imediatamente
      identifier: `temp_${Date.now()}`,
    });

    await saveAlertToHistory(temperature, type, message);
  };

  return { sendLocalNotification };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("temperature-alerts", {
      name: "Alertas de Temperatura",
      description: "Notificações sobre novas leituras de temperatura",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#667eea",
      sound: "default",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return token;
}
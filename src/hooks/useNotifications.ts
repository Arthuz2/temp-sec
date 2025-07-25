import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";

// (Removed duplicate implementation of useNotifications and registerForPushNotificationsAsync)

interface Temperature {
  data: string;
  valor: number;
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
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

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

    if (temperatureValue >= 35) {
      icon = "🔥";
      priority = Notifications.AndroidNotificationPriority.HIGH;
    } else if (temperatureValue <= 10) {
      icon = "❄️";
      priority = Notifications.AndroidNotificationPriority.HIGH;
    } else if (temperatureValue >= 25) {
      icon = "☀️";
    } else {
      icon = "🌤️";
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${icon} Nova Temperatura Registrada`,
        body: `${temperatureValue}°C registrados às ${timeAgo}`,
        data: {
          temperature: temperatureValue,
          timestamp: temperature.data,
          type: "new_temperature",
        },
        sound:
          temperatureValue >= 35 || temperatureValue <= 10 ? "default" : false,
      },
      trigger: null, // Enviar imediatamente
      identifier: `temp_${Date.now()}`,
    });
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

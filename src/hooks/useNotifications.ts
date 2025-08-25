import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

interface Temperature {
  data: string;
  valor: number;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
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

  const sendLocalNotification = async (temperature: Temperature) => { };

  return { sendLocalNotification };
}

async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("critical-alerts", {
        name: "Alertas Críticos de Temperatura",
        description: "Notificações de temperatura fora dos limites seguros",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 500, 500],
        lightColor: "#FF4757",
        sound: "default",
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
        bypassDnd: true,
      });

      await Notifications.setNotificationChannelAsync("temperature-alerts", {
        name: "Alertas de Temperatura",
        description: "Notificações sobre novas leituras de temperatura",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF6B6B",
        sound: "default",
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.warn("Permissão para notificações não concedida");
      return null;
    }
    return finalStatus;
  } catch (error) {
    console.error("Erro ao registrar notificações:", error);
    return null;
  }
}

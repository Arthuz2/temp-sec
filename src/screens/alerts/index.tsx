
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Switch, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../hooks/useTheme";
import { useNotificationContext } from "../../contexts/NotificationContext";
import styles from "./styles";

interface NotificationHistoryItem {
  id: string;
  type: "high_temperature" | "low_temperature" | "normal_temperature" | "system";
  title: string;
  message: string;
  temperature?: number;
  timestamp: Date;
  read: boolean;
}

interface NotificationSettings {
  sound: boolean;
  vibration: boolean;
  popup: boolean;
  background: boolean;
  highTempAlert: boolean;
  lowTempAlert: boolean;
  normalTempAlert: boolean;
}

export function Alerts() {
  const theme = useTheme();
  const { isBackgroundTaskRegistered, registerBackgroundTask } = useNotificationContext();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    sound: true,
    vibration: true,
    popup: true,
    background: true,
    highTempAlert: true,
    lowTempAlert: true,
    normalTempAlert: false,
  });
  const [notificationHistory, setNotificationHistory] = useState<NotificationHistoryItem[]>([]);

  useEffect(() => {
    loadNotificationSettings();
    loadNotificationHistory();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem("notificationSettings");
      if (settings) {
        setNotificationSettings(JSON.parse(settings));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const loadNotificationHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("notificationHistory");
      if (history) {
        const parsedHistory = JSON.parse(history).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp),
        }));
        setNotificationHistory(parsedHistory.sort((a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ));
      } else {
        // Gerar histórico de exemplo se não houver dados
        generateSampleHistory();
      }
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      generateSampleHistory();
    }
  };

  const generateSampleHistory = () => {
    const sampleHistory: NotificationHistoryItem[] = [
      {
        id: "1",
        type: "high_temperature",
        title: "🔥 Temperatura Alta Detectada",
        message: "Temperatura de 42.3°C registrada",
        temperature: 42.3,
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
      },
      {
        id: "2",
        type: "high_temperature",
        title: "🔥 Temperatura Muito Alta",
        message: "Temperatura de 45.1°C registrada",
        temperature: 45.1,
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        read: true,
      },
      {
        id: "3",
        type: "normal_temperature",
        title: "🌡️ Nova Leitura",
        message: "Temperatura de 36.8°C registrada",
        temperature: 36.8,
        timestamp: new Date(Date.now() - 75 * 60 * 1000),
        read: true,
      },
      {
        id: "4",
        type: "low_temperature",
        title: "❄️ Temperatura Baixa",
        message: "Temperatura de 8.2°C registrada",
        temperature: 8.2,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: "5",
        type: "system",
        title: "📱 Sistema Iniciado",
        message: "Monitoramento de temperatura ativado",
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
        read: true,
      },
    ];
    setNotificationHistory(sampleHistory);
  };

  const saveNotificationSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem("notificationSettings", JSON.stringify(newSettings));
      setNotificationSettings(newSettings);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const handleBackgroundNotificationToggle = async (enabled: boolean) => {
    if (enabled && !isBackgroundTaskRegistered) {
      try {
        await registerBackgroundTask();
        Alert.alert(
          "Notificações em Background",
          "As notificações em segundo plano foram ativadas com sucesso!"
        );
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível ativar as notificações em segundo plano."
        );
        return;
      }
    }

    const newSettings = { ...notificationSettings, background: enabled };
    await saveNotificationSettings(newSettings);
  };

  const markAsRead = async (id: string) => {
    const updatedHistory = notificationHistory.map(item =>
      item.id === id ? { ...item, read: true } : item
    );
    setNotificationHistory(updatedHistory);

    try {
      await AsyncStorage.setItem("notificationHistory", JSON.stringify(updatedHistory));
    } catch (error) {
      console.error("Erro ao marcar como lida:", error);
    }
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      "Limpar Histórico",
      "Deseja limpar todo o histórico de notificações?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            setNotificationHistory([]);
            try {
              await AsyncStorage.removeItem("notificationHistory");
            } catch (error) {
              console.error("Erro ao limpar histórico:", error);
            }
          },
        },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "high_temperature":
        return "flame";
      case "low_temperature":
        return "snow";
      case "normal_temperature":
        return "thermometer";
      case "system":
        return "settings";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "high_temperature":
        return "#FF6B6B";
      case "low_temperature":
        return "#4ECDC4";
      case "normal_temperature":
        return "#95E1A3";
      case "system":
        return "#667eea";
      default:
        return theme.colors.text;
    }
  };

  const getAlertTypeName = (type: string) => {
    switch (type) {
      case "high_temperature":
        return "Temperatura Alta";
      case "low_temperature":
        return "Temperatura Baixa";
      case "normal_temperature":
        return "Temperatura Normal";
      case "system":
        return "Sistema";
      default:
        return "Desconhecido";
    }
  };

  const unreadCount = notificationHistory.filter(item => !item.read).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Alertas e Notificações
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: "#FF6B6B" }]}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        {/* Configurações de Notificação */}
        <View style={[styles.settingsSection, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Configurações de Notificação
          </Text>

          {/* Configurações Básicas */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Som</Text>
            </View>
            <Switch
              value={notificationSettings.sound}
              onValueChange={(value) =>
                saveNotificationSettings({ ...notificationSettings, sound: value })
              }
              trackColor={{ false: theme.colors.border, true: "#4ECDC4" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Vibração</Text>
            </View>
            <Switch
              value={notificationSettings.vibration}
              onValueChange={(value) =>
                saveNotificationSettings({ ...notificationSettings, vibration: value })
              }
              trackColor={{ false: theme.colors.border, true: "#4ECDC4" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications" size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>Pop-up</Text>
            </View>
            <Switch
              value={notificationSettings.popup}
              onValueChange={(value) =>
                saveNotificationSettings({ ...notificationSettings, popup: value })
              }
              trackColor={{ false: theme.colors.border, true: "#4ECDC4" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="timer" size={20} color={theme.colors.text} />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Notificações em Background
              </Text>
            </View>
            <Switch
              value={notificationSettings.background}
              onValueChange={handleBackgroundNotificationToggle}
              trackColor={{ false: theme.colors.border, true: "#4ECDC4" }}
            />
          </View>

          {/* Divisor */}
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

          {/* Tipos de Alerta */}
          <Text style={[styles.subsectionTitle, { color: theme.colors.text }]}>
            Tipos de Alerta
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="flame" size={20} color="#FF6B6B" />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Temperatura Alta
              </Text>
            </View>
            <Switch
              value={notificationSettings.highTempAlert}
              onValueChange={(value) =>
                saveNotificationSettings({ ...notificationSettings, highTempAlert: value })
              }
              trackColor={{ false: theme.colors.border, true: "#FF6B6B" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="snow" size={20} color="#4ECDC4" />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Temperatura Baixa
              </Text>
            </View>
            <Switch
              value={notificationSettings.lowTempAlert}
              onValueChange={(value) =>
                saveNotificationSettings({ ...notificationSettings, lowTempAlert: value })
              }
              trackColor={{ false: theme.colors.border, true: "#4ECDC4" }}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="thermometer" size={20} color="#95E1A3" />
              <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                Temperatura Normal
              </Text>
            </View>
            <Switch
              value={notificationSettings.normalTempAlert}
              onValueChange={(value) =>
                saveNotificationSettings({ ...notificationSettings, normalTempAlert: value })
              }
              trackColor={{ false: theme.colors.border, true: "#95E1A3" }}
            />
          </View>

          {isBackgroundTaskRegistered && (
            <View style={[styles.backgroundInfo, { backgroundColor: theme.colors.background }]}>
              <Ionicons name="checkmark-circle" size={16} color="#4ECDC4" />
              <Text style={[styles.backgroundInfoText, { color: theme.colors.textSecondary }]}>
                Notificações em segundo plano ativas
              </Text>
            </View>
          )}
        </View>

        {/* Histórico de Notificações */}
        <View style={styles.historySection}>
          <View style={styles.historySectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Histórico de Notificações
            </Text>
            {notificationHistory.length > 0 && (
              <TouchableOpacity onPress={clearAllNotifications} style={styles.clearButton}>
                <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
                <Text style={[styles.clearButtonText, { color: "#FF6B6B" }]}>Limpar</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.historyList}>
            {notificationHistory.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
                <Ionicons name="notifications-off" size={48} color={theme.colors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                  Nenhuma notificação ainda
                </Text>
              </View>
            ) : (
              notificationHistory.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    {
                      backgroundColor: theme.colors.surface,
                      borderLeftColor: getNotificationColor(notification.type),
                      opacity: notification.read ? 0.7 : 1,
                    },
                  ]}
                  onPress={() => markAsRead(notification.id)}
                >
                  <View style={styles.notificationHeader}>
                    <View style={styles.notificationIconContainer}>
                      <Ionicons
                        name={getNotificationIcon(notification.type)}
                        size={24}
                        color={getNotificationColor(notification.type)}
                      />
                      {!notification.read && <View style={styles.unreadDot} />}
                    </View>
                    <View style={styles.notificationContent}>
                      <View style={styles.notificationMeta}>
                        <Text style={[styles.notificationType, { color: getNotificationColor(notification.type) }]}>
                          {getAlertTypeName(notification.type)}
                        </Text>
                        <Text style={[styles.notificationTime, { color: theme.colors.textSecondary }]}>
                          {format(notification.timestamp, "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </Text>
                      </View>
                      <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
                        {notification.title}
                      </Text>
                      <Text style={[styles.notificationMessage, { color: theme.colors.textSecondary }]}>
                        {notification.message}
                      </Text>
                    </View>
                    {notification.temperature && (
                      <View style={styles.temperatureBadge}>
                        <Text style={[styles.temperatureValue, { color: getNotificationColor(notification.type) }]}>
                          {notification.temperature}°C
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

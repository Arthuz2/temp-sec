import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './styles';

interface NotificationAlert {
  id: string;
  timestamp: string;
  temperature: number;
  type: 'high' | 'low' | 'normal';
  message: string;
}

export function Alerts() {
  const theme = useTheme();
  const { notificationSettings, updateNotificationSettings, temperatureUnit } = useSettings();
  const [alertHistory, setAlertHistory] = useState<NotificationAlert[]>([]);

  const convertTemperature = (temp: number) => {
    return temperatureUnit === '°F' ? (temp * 9 / 5) + 32 : temp;
  };

  useEffect(() => {
    loadAlertHistory();

    const interval = setInterval(loadAlertHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadAlertHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('alertHistory');

      if (stored) {
        const history: NotificationAlert[] = JSON.parse(stored);

        const criticalAlerts = history.filter(alert =>
          alert.type === 'high' || alert.type === 'low'
        );

        setAlertHistory(criticalAlerts.slice(0, 50));
      } else {
        setAlertHistory([]);
      }
    } catch (error) {
      setAlertHistory([]);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todo o histórico de alertas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('alertHistory');
              setAlertHistory([]);
            } catch (error) {
              console.error('Erro ao limpar histórico:', error);
            }
          }
        }
      ]
    );
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high':
        return { name: 'flame', color: '#ff4757' };
      case 'low':
        return { name: 'snow', color: '#3742fa' };
      default:
        return { name: 'thermometer', color: '#2ed573' };
    }
  };

  const getAlertTypeText = (type: string) => {
    switch (type) {
      case 'high':
        return 'Temperatura Alta';
      case 'low':
        return 'Temperatura Baixa';
      default:
        return 'Temperatura Normal';
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    updateNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Ionicons name="notifications" size={24} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Alertas
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Configurações de Notificação
            </Text>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="volume-high" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Sons
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Reproduzir som ao receber alertas
                </Text>
              </View>
            </View>
            <Switch
              value={notificationSettings.sound}
              onValueChange={() => handleNotificationToggle('sound')}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="phone-portrait" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Vibração
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Vibrar o dispositivo ao receber alertas
                </Text>
              </View>
            </View>
            <Switch
              value={notificationSettings.vibration}
              onValueChange={() => handleNotificationToggle('vibration')}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Pop-up
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Exibir notificações pop-up na tela
                </Text>
              </View>
            </View>
            <Switch
              value={notificationSettings.popup}
              onValueChange={() => handleNotificationToggle('popup')}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="time" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Histórico de Notificações
            </Text>
            {alertHistory.length > 0 && (
              <TouchableOpacity onPress={clearHistory}>
                <Ionicons name="trash" size={18} color={theme.colors.error} />
              </TouchableOpacity>
            )}
          </View>

          {alertHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="notifications-off" size={48} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: theme.colors.textSecondary }]}>
                Nenhum alerta crítico hoje
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.colors.textSecondary }]}>
                Alertas de temperatura fora do ideal aparecerão aqui
              </Text>
            </View>
          ) : (
            alertHistory.map((alert) => {
              const iconInfo = getAlertIcon(alert.type);
              return (
                <View key={alert.id} style={[styles.alertItem, { borderLeftColor: iconInfo.color }]}>
                  <View style={styles.alertHeader}>
                    <View style={styles.alertIcon}>
                      <Ionicons name={iconInfo.name as any} size={20} color={iconInfo.color} />
                    </View>
                    <View style={styles.alertInfo}>
                      <Text style={[styles.alertType, { color: theme.colors.text }]}>
                        {getAlertTypeText(alert.type)}
                      </Text>
                      <Text style={[styles.alertTemperature, { color: iconInfo.color }]}>
                        {convertTemperature(alert.temperature).toFixed(1)}{temperatureUnit}
                      </Text>
                    </View>
                    <Text style={[styles.alertTime, { color: theme.colors.textSecondary }]}>
                      {formatDate(alert.timestamp)}
                    </Text>
                  </View>
                  <Text style={[styles.alertMessage, { color: theme.colors.textSecondary }]}>
                    {alert.message}
                  </Text>
                </View>
              );
            })
          )}
        </View>

        {alertHistory.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.sectionHeader}>
              <Ionicons name="stats-chart" size={20} color={theme.colors.primary} />
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Estatísticas de Hoje
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.error }]}>
                  {alertHistory.filter(a => a.type === 'high').length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Temperatura Alta
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: '#3742fa' }]}>
                  {alertHistory.filter(a => a.type === 'low').length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Temperatura Baixa
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.colors.text }]}>
                  {alertHistory.length}
                </Text>
                <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                  Total Críticos
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTemperatureDetection } from '../../hooks/useTemperatureDetection';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './styles';

interface HistoryItemProps {
  temperature: {
    data: string;
    valor: number;
  };
}

export function HistoryItem({ temperature }: HistoryItemProps) {
  const theme = useTheme();
  const { temperatureUnit } = useSettings();
  const { getTemperatureStatus } = useTemperatureDetection();

  const status = getTemperatureStatus(temperature);
  const date = new Date(temperature.data);

  const timeString = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const dateString = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit'
  });

  // Converter temperatura baseado na unidade
  const displayTemp = temperatureUnit === '°F'
    ? (temperature.valor * 9 / 5) + 32
    : temperature.valor;

  return (
    <View style={styles.container}>
      <Ionicons name={status.icon} size={24} color={status.color} />
      <View>
        <Text style={{ color: theme.colors.text }}>{dateString}</Text>
        <Text style={{ color: theme.colors.text }}>{timeString}</Text>
      </View>
      <Text style={[styles.temperature, { color: status.color }]}>
        {displayTemp.toFixed(1)}{temperatureUnit}
      </Text>
    </View>
  );
}
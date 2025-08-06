import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './styles';

interface StatusIndicatorProps {
  temperature: number;
}

export function StatusIndicator({ temperature }: StatusIndicatorProps) {
  const theme = useTheme();
  const { temperatureLimits, temperatureUnit } = useSettings();

  const convertTemperature = (temp: number) => {
    return temperatureUnit === '°F' ? (temp * 9 / 5) + 32 : temp;
  };

  const displayTemp = convertTemperature(temperature);
  const displayLimits = {
    min: convertTemperature(temperatureLimits.min),
    max: convertTemperature(temperatureLimits.max),
    ideal: {
      min: convertTemperature(temperatureLimits.ideal.min),
      max: convertTemperature(temperatureLimits.ideal.max),
    },
  };

  const getStatus = () => {
    if (displayTemp <= displayLimits.min) {
      return {
        status: 'danger',
        color: '#3742fa',
        icon: 'snow',
        text: 'Muito Baixa',
        description: 'Temperatura crítica'
      };
    }

    if (displayTemp >= displayLimits.max) {
      return {
        status: 'danger',
        color: '#ff4757',
        icon: 'flame',
        text: 'Muito Alta',
        description: 'Temperatura crítica'
      };
    }

    if (displayTemp >= displayLimits.ideal.min && displayTemp <= displayLimits.ideal.max) {
      return {
        status: 'ideal',
        color: '#2ed573',
        icon: 'checkmark-circle',
        text: 'Ideal',
        description: 'Temperatura perfeita para secagem'
      };
    }

    if (displayTemp < displayLimits.ideal.min) {
      return {
        status: 'attention',
        color: '#70a1ff',
        icon: 'alert-circle',
        text: 'Baixa',
        description: 'Monitorar temperatura'
      };
    }

    return {
      status: 'attention',
      color: '#ffa502',
      icon: 'alert-circle',
      text: 'Alta',
      description: 'Monitorar temperatura'
    };
  };

  const status = getStatus();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
      <View style={[styles.indicator, { backgroundColor: status.color }]}>
        <Ionicons name={status.icon as any} size={20} color="white" />
      </View>
      <View style={styles.info}>
        <Text style={[styles.statusText, { color: theme.colors.text }]}>
          {status.text}
        </Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>{status.description}</Text>
      </View>
    </View>
  );
}
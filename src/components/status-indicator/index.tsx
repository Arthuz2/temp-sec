import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import styles from './styles';

interface StatusIndicatorProps {
  temperature: number;
}

export function StatusIndicator({ temperature }: StatusIndicatorProps) {
  const theme = useTheme();

  const temperatureLimits = {
    min: 10,
    max: 30,
    ideal: {
      min: 20,
      max: 25,
    },
  };

  const getStatus = () => {
    if (temperature < temperatureLimits.min || temperature > temperatureLimits.max) {
      return {
        status: 'danger',
        color: '#FF6B6B',
        icon: 'warning',
        text: 'Fora do Padrão',
        description: 'Temperatura crítica'
      };
    }

    if (temperature >= temperatureLimits.ideal.min && temperature <= temperatureLimits.ideal.max) {
      return {
        status: 'ideal',
        color: '#4ECDC4',
        icon: 'checkmark-circle',
        text: 'Ideal',
        description: 'Temperatura perfeita'
      };
    }

    return {
      status: 'attention',
      color: '#FFD93D',
      icon: 'alert-circle',
      text: 'Atenção',
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
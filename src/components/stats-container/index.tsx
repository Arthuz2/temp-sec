import React from 'react';
import { View } from 'react-native';
import { StatCard } from '../stat-card';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './styles';


interface Temperature {
  data: string
  valor: number
}
interface StatsContainerProps {
  temperatures: Temperature[]
}

export function StatsContainer({ temperatures }: StatsContainerProps) {
  const { temperatureUnit } = useSettings();

  if (!temperatures || temperatures.length === 0) {
    return null;
  }

  const todayTemperatures = temperatures.filter(t => new Date(t.data).toDateString() === new Date().toDateString());

  const values = todayTemperatures.map(t => t.valor);
  const maxTemp = Math.max(...values);
  const minTemp = Math.min(...values);
  const avgTemp = values.reduce((sum, temp) => sum + temp, 0) / values.length;

  const convertTemp = (temp: number) =>
    temperatureUnit === '°F' ? (temp * 9 / 5) + 32 : temp;

  const displayMaxTemp = convertTemp(maxTemp);
  const displayMinTemp = convertTemp(minTemp);
  const displayAvgTemp = convertTemp(avgTemp);

  return (
    <View style={styles.container}>
      <StatCard
        label="Máxima"
        value={parseFloat(displayMaxTemp.toFixed(1))}
        unit={temperatureUnit}
        icon="arrow-up"
        colors={["#ff4757", "#ff6b81"]}
      />
      <StatCard
        label="Mínima"
        value={parseFloat(displayMinTemp.toFixed(1))}
        unit={temperatureUnit}
        icon="arrow-down"
        colors={["#3742fa", "#5352ed"]}
      />
      <StatCard
        label="Média"
        value={parseFloat(displayAvgTemp.toFixed(1))}
        unit={temperatureUnit}
        icon="trending-up"
        colors={["#2ed573", "#70a1ff"]}
      />
    </View>
  );
}
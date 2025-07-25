import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import styles, { iconSize } from "./styles"

interface Temperature {
  data: string
  valor: number
}

interface HistoryItemProps {
  temperature: Temperature
  avgTemp: number
}

export function HistoryItem({ temperature, avgTemp }: HistoryItemProps) {
  const getWeatherIcon = (temp: number) => {
    if (temp >= 30) return "sunny"
    if (temp >= 25) return "partly-sunny"
    if (temp >= 20) return "cloudy"
    return "rainy"
  }

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Ionicons name={getWeatherIcon(temperature.valor)} size={iconSize} color="#667eea" />
        <View style={styles.info}>
          <Text style={styles.date}>
            {new Date(temperature.data).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })}
          </Text>
          <Text style={styles.time}>{formatDistanceToNow(new Date(temperature.data), { locale: ptBR })} atrás</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.temperature}>{temperature.valor}°C</Text>
        <View style={[styles.indicator, { backgroundColor: temperature.valor >= avgTemp ? "#4ECDC4" : "#FF6B6B" }]} />
      </View>
    </View>
  )
}

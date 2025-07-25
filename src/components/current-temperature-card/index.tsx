import { View, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import styles, { iconSize } from "./styles"

interface Temperature {
  data: string
  valor: number
}

interface CurrentTemperatureCardProps {
  temperature: Temperature
}

export function CurrentTemperatureCard({ temperature }: CurrentTemperatureCardProps) {
  const getWeatherIcon = (temp: number) => {
    if (temp >= 30) return "sunny"
    if (temp >= 25) return "partly-sunny"
    if (temp >= 20) return "cloudy"
    return "rainy"
  }

  const getWeatherColor = (temp: number): [string, string] => {
    if (temp >= 30) return ["#FF6B6B", "#FF8E53"]
    if (temp >= 25) return ["#4ECDC4", "#44A08D"]
    if (temp >= 20) return ["#8ee2deff", "#e2bbc7ff"]
    return ["#667eea", "#764ba2"]
  }

  return (
    <LinearGradient colors={getWeatherColor(temperature.valor)} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.upSection}>
          <Ionicons name={getWeatherIcon(temperature.valor)} size={iconSize} color="white" />
          <Text style={styles.temperatureValue}>{temperature.valor}°C</Text>
        </View>
        <View style={styles.bottomSection}>
          <Text style={styles.label}>Temperatura Atual</Text>
          <Text style={styles.time}>{formatDistanceToNow(new Date(temperature.data), { locale: ptBR })} atrás</Text>
        </View>
      </View>
    </LinearGradient>
  )
}

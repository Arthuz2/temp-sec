import { View, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import styles, { iconSize } from "./styles"
import { useSettings } from '../../contexts/SettingsContext';

interface Temperature {
  data: string
  valor: number
}

interface CurrentTemperatureCardProps {
  temperature: Temperature
}

export function CurrentTemperatureCard({ temperature }: CurrentTemperatureCardProps) {
  const { temperatureLimits, temperatureUnit } = useSettings()

  const getRoastingIcon = (temp: number) => {
    if (temp >= temperatureLimits.max) return "flame"
    if (temp >= temperatureLimits.ideal.max) return "sunny"
    if (temp >= temperatureLimits.ideal.min) return "thermometer"
    if (temp >= temperatureLimits.min) return "water"
    return "snow"
  }

  const getRoastingColor = (temp: number): [string, string] => {
    if (temp >= temperatureLimits.max) return ["#8B4513", "#654321"]
    if (temp >= temperatureLimits.ideal.max) return ["#D2691E", "#A0522D"]
    if (temp >= temperatureLimits.ideal.min) return ["#DEB887", "#CD853F"]
    if (temp >= temperatureLimits.min) return ["#F4A460", "#DAA520"]
    return ["#708090", "#2F4F4F"]
  }

  const getRoastingStatus = (temp: number) => {
    if (temp >= temperatureLimits.max) return "Torra Escura"
    if (temp >= temperatureLimits.ideal.max) return "Torra Média"
    if (temp >= temperatureLimits.ideal.min) return "Torra Clara"
    if (temp >= temperatureLimits.min) return "Pré-aquecimento"
    return "Aguardando"
  }

  const displayTemp = temperatureUnit === '°F'
    ? (temperature.valor * 9 / 5) + 32
    : temperature.valor;

  return (
    <LinearGradient colors={getRoastingColor(temperature.valor)} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.upSection}>
          <Ionicons name={getRoastingIcon(temperature.valor)} size={iconSize} color="white" />
          <Text style={styles.temperatureValue}>{displayTemp.toFixed(1)}{temperatureUnit}</Text>
        </View>
        <View style={styles.bottomSection}>
          <Text style={styles.label}>{getRoastingStatus(temperature.valor)}</Text>
          <Text style={styles.time}>Torra de Café • {formatDistanceToNow(new Date(temperature.data), { locale: ptBR })} atrás</Text>
        </View>
      </View>
    </LinearGradient>
  )
}
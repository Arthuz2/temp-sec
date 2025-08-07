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
  const getRoastingIcon = (temp: number) => {
    if (temp >= 220) return "flame"
    if (temp >= 200) return "sunny"
    if (temp >= 180) return "thermometer"
    if (temp >= 150) return "water"
    return "snow"
  }

  const getRoastingColor = (temp: number): [string, string] => {
    if (temp >= 220) return ["#8B4513", "#654321"]
    if (temp >= 200) return ["#D2691E", "#A0522D"]
    if (temp >= 180) return ["#DEB887", "#CD853F"]
    if (temp >= 150) return ["#F4A460", "#DAA520"]
    return ["#708090", "#2F4F4F"]
  }

  const getRoastingStatus = (temp: number) => {
    if (temp >= 220) return "Torra Escura"
    if (temp >= 200) return "Torra Média"
    if (temp >= 180) return "Torra Clara"
    if (temp >= 150) return "Pré-aquecimento"
    return "Aguardando"
  }

  const { temperatureUnit } = useSettings();

  // Converter temperatura baseado na unidade
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
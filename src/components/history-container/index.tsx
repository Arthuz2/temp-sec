import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { HistoryItem } from "../history-item"
import styles from "./styles"

interface Temperature {
  data: string
  valor: number
}

interface HistoryContainerProps {
  temperatures: Temperature[]
  avgTemp: number
}

export function HistoryContainer({ temperatures, avgTemp }: HistoryContainerProps) {
  temperatures = temperatures.slice().slice(0, 8)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico Recente</Text>
      {temperatures && temperatures.length > 0 ? (
        temperatures.map((temperature, index) => (
          <HistoryItem key={`${temperature.data}-${index}`} temperature={temperature} avgTemp={avgTemp} />
        ))
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="time" size={40} color="#ccc" />
          <Text style={styles.noDataText}>Nenhum histórico disponível</Text>
        </View>
      )}
    </View>
  )
}

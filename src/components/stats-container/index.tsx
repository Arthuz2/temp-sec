import { View } from "react-native"
import { StatCard } from "../stat-card"
import styles from "./styles"

interface Temperature {
  data: string
  valor: number
}

interface StatsContainerProps {
  temperatures: Temperature[]
}

export function StatsContainer({ temperatures }: StatsContainerProps) {
  const maxTemp = temperatures.length > 0 ? Math.max(...temperatures.map((t) => t.valor)) : 0
  const minTemp = temperatures.length > 0 ? Math.min(...temperatures.map((t) => t.valor)) : 0
  const avgTemp =
    temperatures.length > 0 ? Math.round(temperatures.reduce((acc, t) => acc + t.valor, 0) / temperatures.length) : 0

  return (
    <View style={styles.container}>
      <StatCard value={maxTemp} label="Máxima" icon="thermometer" colors={["#FF6B6B", "#FF8E53"]} />
      <StatCard value={minTemp} label="Mínima" icon="snow" colors={["#4ECDC4", "#44A08D"]} />
      <StatCard value={avgTemp} label="Média" icon="analytics" colors={["#A8EDEA", "#FED6E3"]} />
    </View>
  )
}

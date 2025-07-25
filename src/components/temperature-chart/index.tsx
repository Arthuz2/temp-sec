import { View, Text, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles, { maxBarHeight } from "./styles"

interface Temperature {
  data: string
  valor: number
}

interface TemperatureChartProps {
  temperatures: Temperature[]
  avgTemp: number
  hasError?: boolean
}

export function TemperatureChart({ temperatures, avgTemp, hasError = false }: TemperatureChartProps) {
  if (!temperatures || temperatures.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Últimas Medições</Text>
        <View style={styles.noDataContainer}>
          <Ionicons name="bar-chart" size={40} color="#ccc" />
          <Text style={styles.noDataText}>Nenhum dado disponível</Text>
        </View>
      </View>
    )
  }

  temperatures = temperatures.slice().slice(0, 8)
  const maxValue = Math.max(...temperatures.map((t) => t.valor))
  const minValue = Math.min(...temperatures.map((t) => t.valor))
  const range = maxValue - minValue || 1

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Últimas Medições</Text>
      {hasError && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning" size={16} color="#FF6B6B" />
          <Text style={styles.errorBannerText}>Usando dados offline</Text>
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartContent}>
          {temperatures.map((temp, index) => {
            const height = ((temp.valor - minValue) / range) * maxBarHeight + 20
            return (
              <View key={`${temp.data}-${index}`} style={styles.chartBar}>
                <Text style={styles.chartValue}>{temp.valor}°</Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor: temp.valor >= avgTemp ? "#4ECDC4" : "#FF6B6B",
                    },
                  ]}
                />
                <Text style={styles.chartDate}>
                  {new Date(temp.data).getDate()}/{new Date(temp.data).getMonth() + 1}
                </Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  )
}

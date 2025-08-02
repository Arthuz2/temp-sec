
import { View, Text, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Svg, { Path, Circle } from 'react-native-svg'
import { useTheme } from "../../hooks/useTheme"
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
  const theme = useTheme();

  if (!temperatures || temperatures.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Gráfico de Temperaturas</Text>
        <View style={styles.noDataContainer}>
          <Ionicons name="bar-chart" size={40} color="#ccc" />
          <Text style={[styles.noDataText, { color: theme.colors.textSecondary }]}>Nenhum dado disponível</Text>
        </View>
      </View>
    )
  }

  const recentTemps = temperatures.slice(-12); // Últimas 12 medições
  const maxValue = Math.max(...recentTemps.map((t) => t.valor))
  const minValue = Math.min(...recentTemps.map((t) => t.valor))
  const range = maxValue - minValue || 1

  const getBarColor = (temp: number) => {
    if (temp >= 40) return "#FF4444" // Vermelho - muito alto
    if (temp >= 35) return "#FF8C00" // Laranja - alto
    if (temp >= 30) return "#4ECDC4" // Verde claro - ideal
    if (temp >= 25) return "#32CD32" // Verde - bom
    return "#87CEEB" // Azul claro - baixo
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Gráfico de Temperaturas</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Últimas {recentTemps.length} medições
        </Text>
      </View>

      {hasError && (
        <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '20' }]}>
          <Ionicons name="warning" size={16} color={theme.colors.error} />
          <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>Usando dados offline</Text>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Máx</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{maxValue.toFixed(1)}°</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Mín</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{minValue.toFixed(1)}°</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Média</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{avgTemp}°</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartContent}>
          <View style={styles.yAxisLabels}>
            <Text style={[styles.yAxisLabel, { color: theme.colors.textSecondary }]}>{maxValue.toFixed(0)}°</Text>
            <Text style={[styles.yAxisLabel, { color: theme.colors.textSecondary }]}>{((maxValue + minValue) / 2).toFixed(0)}°</Text>
            <Text style={[styles.yAxisLabel, { color: theme.colors.textSecondary }]}>{minValue.toFixed(0)}°</Text>
          </View>

          <View style={styles.chartContainer}>
            <Svg height={maxBarHeight + 40} width={recentTemps.length * 60 + 20} style={styles.svgChart}>
              {/* Linha do gráfico */}
              <Path
                d={recentTemps.map((temp, index) => {
                  const x = index * 60 + 30
                  const y = maxBarHeight + 20 - (((temp.valor - minValue) / range) * maxBarHeight)
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
                }).join(' ')}
                stroke={theme.colors.primary || "#4ECDC4"}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Pontos do gráfico */}
              {recentTemps.map((temp, index) => {
                const x = index * 60 + 30
                const y = maxBarHeight + 20 - (((temp.valor - minValue) / range) * maxBarHeight)

                return (
                  <Circle
                    key={`point-${index}`}
                    cx={x}
                    cy={y}
                    r="6"
                    fill={getBarColor(temp.valor)}
                    stroke="white"
                    strokeWidth="2"
                  />
                )
              })}
            </Svg>

            {/* Labels e valores */}
            <View style={styles.labelsContainer}>
              {recentTemps.map((temp, index) => (
                <View key={`${temp.data}-${index}`} style={[styles.chartPoint, { left: index * 60 + 10 }]}>
                  <Text style={[styles.chartValue, { color: theme.colors.text }]}>
                    {temp.valor.toFixed(1)}°
                  </Text>
                  <Text style={[styles.chartDate, { color: theme.colors.textSecondary }]}>
                    {new Date(temp.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).replace(',', '\n')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#32CD32" }]} />
          <Text style={[styles.legendLabel, { color: theme.colors.textSecondary }]}>Ideal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FF8C00" }]} />
          <Text style={[styles.legendLabel, { color: theme.colors.textSecondary }]}>Atenção</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: "#FF4444" }]} />
          <Text style={[styles.legendLabel, { color: theme.colors.textSecondary }]}>Crítico</Text>
        </View>
      </View>
    </View>
  )
}

import { View, Text, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Svg, { Path, Circle } from 'react-native-svg'
import { useTheme } from "../../hooks/useTheme"
import styles, { maxBarHeight } from "./styles"
import { useSettings } from "../../contexts/SettingsContext"

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
  const { temperatureUnit } = useSettings();

  const recentTemps = temperatures.filter(t => new Date(t.data).toDateString() === new Date().toDateString());
  let maxValue = Math.max(...recentTemps.map((t) => t.valor))
  let minValue = Math.min(...recentTemps.map((t) => t.valor))
  if (maxValue === -Infinity || minValue === Infinity) {
    minValue = 0;
    maxValue = 0;
  }
  const range = maxValue - minValue || 1;

  const convertTemperature = (temp: number) => {
    return temperatureUnit === '°F' ? (temp * 9 / 5) + 32 : temp;
  }

  const getBarColor = (temp: number) => {
    const convertedTemp = convertTemperature(temp);
    const { temperatureLimits } = useSettings();

    const convertedLimits = {
      min: convertTemperature(temperatureLimits.min),
      max: convertTemperature(temperatureLimits.max),
      ideal: {
        min: convertTemperature(temperatureLimits.ideal.min),
        max: convertTemperature(temperatureLimits.ideal.max)
      }
    };

    if (convertedTemp <= convertedLimits.min) return "#3742fa" // Azul - muito baixo
    if (convertedTemp >= convertedLimits.max) return "#ff4757" // Vermelho - muito alto
    if (convertedTemp >= convertedLimits.ideal.min && convertedTemp <= convertedLimits.ideal.max) return "#2ed573" // Verde - ideal
    if (convertedTemp < convertedLimits.ideal.min) return "#70a1ff" // Azul claro - baixo
    return "#ffa502" // Laranja - atenção
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
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{convertTemperature(maxValue).toFixed(1)}{temperatureUnit}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Mín</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{convertTemperature(minValue).toFixed(1)}{temperatureUnit}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Média</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{convertTemperature(avgTemp).toFixed(1)}{temperatureUnit}</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.chartContent}>
          <View style={styles.yAxisLabels}>
            <Text style={[styles.yAxisLabel, { color: theme.colors.textSecondary }]}>{convertTemperature(maxValue).toFixed(0)}{temperatureUnit}</Text>
            <Text style={[styles.yAxisLabel, { color: theme.colors.textSecondary }]}>{convertTemperature((maxValue + minValue) / 2).toFixed(0)}{temperatureUnit}</Text>
            <Text style={[styles.yAxisLabel, { color: theme.colors.textSecondary }]}>{convertTemperature(minValue).toFixed(0)}{temperatureUnit}</Text>
          </View>

          <View style={styles.chartContainer}>
            <Svg height={maxBarHeight + 40} width={recentTemps.length * 60 + 20} style={styles.svgChart}>
              {/* Linha do gráfico */}
              <Path
                d={recentTemps.map((temp, index) => {
                  const convertedTemp = convertTemperature(temp.valor);
                  const x = index * 60 + 30
                  const y = maxBarHeight + 20 - (((convertedTemp - convertTemperature(minValue)) / range) * maxBarHeight)
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
                const convertedTemp = convertTemperature(temp.valor);
                const x = index * 60 + 30
                const y = maxBarHeight + 20 - (((convertedTemp - convertTemperature(minValue)) / range) * maxBarHeight)

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
                    {convertTemperature(temp.valor).toFixed(1)}{temperatureUnit}
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
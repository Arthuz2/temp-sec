import { Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import styles, { iconSize } from "./styles"

interface StatCardProps {
  value: number
  label: string
  icon: keyof typeof Ionicons.glyphMap
  colors: [string, string]
  unit?: string
}

export function StatCard({ value, label, icon, colors, unit = "°C" }: StatCardProps) {
  return (
    <LinearGradient colors={colors} style={styles.container}>
      <Ionicons name={icon} size={iconSize} color="white" />
      <Text style={styles.value}>
        {value}
        {unit}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </LinearGradient>
  )
}

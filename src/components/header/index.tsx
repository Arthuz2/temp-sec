import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../hooks/useTheme"
import styles from "./styles"

export function Header() {
  const theme = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="thermometer" size={28} color="white" />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>TempSec</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Monitoramento em Tempo Real
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}
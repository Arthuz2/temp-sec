import { View, Text } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import styles from "./styles"

export function Header() {
  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>TempSec</Text>
      </View>
      <Text style={styles.subtitle}>Monitoramento de Temperatura</Text>
    </LinearGradient>
  )
}

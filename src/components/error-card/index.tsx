import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import styles from "./styles"

interface ErrorCardProps {
  onRetry?: () => void
}

export function ErrorCard({ onRetry }: ErrorCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="cloud-offline" size={24} color="#FF6B6B" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Modo Offline</Text>
          <Text style={styles.message}>Não foi possível conectar ao servidor. Exibindo dados salvos.</Text>
          <Text style={styles.retryInfo}>Tentando reconectar automaticamente...</Text>
        </View>
      </View>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={16} color="#FF6B6B" />
          <Text style={styles.retryText}>Tentar Novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

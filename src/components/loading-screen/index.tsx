import { View, Text, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

export function LoadingScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
        <Ionicons name="thermometer" size={60} color="white" />
        <ActivityIndicator size="large" color="white" style={styles.spinner} />
        <Text style={styles.title}>TempSec</Text>
        <Text style={styles.subtitle}>Carregando dados de temperatura...</Text>
      </LinearGradient>
    </View>
  );
}

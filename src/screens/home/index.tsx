import { ScrollView, RefreshControl, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getAllTemperature } from "../../api/getAllTemperature";
import { getLastTemperature } from "../../api/getLastTemperature";
import { LoadingScreen } from "../../components/loading-screen";
import { Header } from "../../components/header";
import { ErrorCard } from "../../components/error-card";
import { CurrentTemperatureCard } from "../../components/current-temperature-card";
import { StatsContainer } from "../../components/stats-container";
import { TemperatureChart } from "../../components/temperature-chart";
import { ToastContainer } from "../../components/toast-container";
import { StatusIndicator } from "../../components/status-indicator";
import { useTemperatureDetection } from "../../hooks/useTemperatureDetection";
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";
import styles from "./styles";

interface Temperature {
  data: string;
  valor: number;
}

export function Home() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, removeToast } = useToast();
  const theme = useTheme();

  const {
    data: allTemperatures,
    isLoading: isLoadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useQuery<Temperature[]>({
    queryKey: ["temperature"],
    queryFn: getAllTemperature,
    retry: 2,
    staleTime: 30 * 1000, // 30 segundos
    refetchInterval: 60 * 1000, // 1 minuto
    refetchIntervalInBackground: true,
  });

  const {
    data: currentTemp,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
    refetch: refetchCurrent,
  } = useQuery<Temperature>({
    queryKey: ["currentTemperature"],
    queryFn: getLastTemperature,
    retry: 2,
    staleTime: 10 * 1000, // 10 segundos
    refetchInterval: 30 * 1000, // 30 segundos
    refetchIntervalInBackground: true,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchAll(), refetchCurrent()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const dataToUse = allTemperatures || [];
  const currentTemperature = currentTemp;

  const avgTemp =
    dataToUse.length > 0
      ? Math.round(
        dataToUse.reduce((acc, t) => acc + t.valor, 0) / dataToUse.length,
      )
      : 0;

  const hasError = !!(errorAll || errorCurrent);

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      {isLoadingAll || isLoadingCurrent ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          style={[
            styles.container,
            { backgroundColor: theme.colors.background },
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]} // Android
              tintColor={theme.colors.primary} // iOS
              title="Atualizando temperaturas..."
              titleColor={theme.colors.primary}
              progressBackgroundColor={theme.colors.surface}
            />
          }
        >
          <Header />

          {hasError && <ErrorCard />}

          {currentTemperature && (
            <CurrentTemperatureCard temperature={currentTemperature} />
          )}

          {currentTemperature && (
            <StatusIndicator temperature={currentTemperature.valor} />
          )}

          <StatsContainer temperatures={dataToUse} />

          <TemperatureChart
            temperatures={dataToUse}
            avgTemp={avgTemp}
            hasError={!!errorAll}
          />

          {/* Informações Complementares */}
          <View style={styles.infoSection}>

            <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
              <View style={styles.infoRow}>
                <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
                <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
                  Faixa Ideal Programada
                </Text>
              </View>
              <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
                35°C - 40°C
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </View>
  );
}

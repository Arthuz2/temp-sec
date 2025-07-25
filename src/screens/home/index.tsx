import { ScrollView, RefreshControl, View } from "react-native";
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
import { HistoryContainer } from "../../components/history-container";
import { ToastContainer } from "../../components/toast-container";
import { useTemperatureDetection } from "../../hooks/useTemperatureDetection";
import { useToast } from "../../hooks/useToast";
import styles from "./styles";

interface Temperature {
  data: string;
  valor: number;
}

export function Home() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toasts, removeToast } = useToast();

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

  useTemperatureDetection(currentTemp, allTemperatures);

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
    <View style={styles.wrapper}>
      {isLoadingAll || isLoadingCurrent ? (
        <LoadingScreen />
      ) : (
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={["#667eea"]} // Android
              tintColor="#667eea" // iOS
              title="Atualizando temperaturas..."
              titleColor="#667eea"
            />
          }
        >
          <Header />

          {hasError && <ErrorCard />}

          {currentTemperature && (
            <CurrentTemperatureCard temperature={currentTemperature} />
          )}

          <StatsContainer temperatures={dataToUse} />

          <TemperatureChart
            temperatures={dataToUse}
            avgTemp={avgTemp}
            hasError={!!errorAll}
          />

          <HistoryContainer temperatures={dataToUse} avgTemp={avgTemp} />
        </ScrollView>
      )}

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </View>
  );
}

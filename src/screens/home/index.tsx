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
import { useToast } from "../../hooks/useToast";
import { useTheme } from "../../hooks/useTheme";
import { useSettings } from "../../contexts/SettingsContext";
import styles from "./styles";

function IdealRangeCard() {
  const theme = useTheme();
  const { temperatureLimits, temperatureUnit } = useSettings();

  const convertTemp = (temp: number) => temperatureUnit === '°F' ? (temp * 9 / 5) + 32 : temp;
  const minIdeal = convertTemp(temperatureLimits.ideal.min).toFixed(1);
  const maxIdeal = convertTemp(temperatureLimits.ideal.max).toFixed(1);

  return (
    <View style={styles.infoSection}>
      <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.cardShadow }]}>
        <View style={styles.infoRow}>
          <Ionicons name="flame-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.infoLabel, { color: theme.colors.text }]}>
            Faixa Ideal de Torra
          </Text>
        </View>
        <Text style={[styles.infoValue, { color: theme.colors.primary }]}>
          {minIdeal}{temperatureUnit} - {maxIdeal}{temperatureUnit}
        </Text>
      </View>
    </View>
  );
}

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
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
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
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
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
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
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

          <IdealRangeCard />
        </ScrollView>
      )}

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </View>
  );
}
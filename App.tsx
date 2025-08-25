import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsProvider, useSettings } from "./src/contexts/SettingsContext";
import { NotificationProvider, useNotificationContext } from "./src/contexts/NotificationContext";
import { useTemperatureMonitor } from "./src/hooks/useTemperatureMonitor";
import { Home } from "./src/screens/home";
import { History } from "./src/screens/history";
import { Alerts } from "./src/screens/alerts";
import { Settings } from "./src/screens/settings";
import { WelcomeScreen } from "./src/screens/welcome";
import { TabBar, TabName } from "./src/components/navigation/TabBar";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

function AppContent() {
  const { darkMode } = useSettings();
  const { isBackgroundTaskRegistered, registerBackgroundTask } = useNotificationContext();
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [showWelcome, setShowWelcome] = useState<boolean | null>(null);

  useTemperatureMonitor();

  useEffect(() => {
    checkFirstTime();
  }, []);

  const checkFirstTime = async () => {
    try {
      const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
      setShowWelcome(hasSeenWelcome === null);
    } catch (error) {
      console.error('Erro ao verificar primeira execução:', error);
      setShowWelcome(false);
    }
  };

  const handleWelcomeComplete = async () => {
    try {
      await AsyncStorage.setItem('hasSeenWelcome', 'true');
      setShowWelcome(false);
    } catch (error) {
      console.error('Erro ao salvar status de boas-vindas:', error);
      setShowWelcome(false);
    }
  };

  if (showWelcome === null) {
    return null;
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  const theme = {
    colors: {
      background: darkMode ? '#121212' : '#f8f9fa',
      surface: darkMode ? '#1e1e1e' : '#ffffff',
      text: darkMode ? '#ffffff' : '#000000',
      textSecondary: darkMode ? '#b3b3b3' : '#666666',
      border: darkMode ? '#333333' : '#e0e0e0',
    }
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'history':
        return <History />;
      case 'alerts':
        return <Alerts />;
      case 'settings':
        return <Settings />;
      default:
        return <Home />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderScreen()}
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

export default function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: true,
      },
    },
  });

  useEffect(() => {
    const configureBackgroundFetch = async () => {
      try {
        const status = await BackgroundFetch.getStatusAsync();

        if (status === BackgroundFetch.BackgroundFetchStatus.Available) {

          await BackgroundFetch.setMinimumIntervalAsync(15);
        } else {
          console.warn('Background fetch não disponível:', status);
        }
      } catch (error) {
        console.error('Erro ao configurar background fetch:', error);
      }
    };

    configureBackgroundFetch();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
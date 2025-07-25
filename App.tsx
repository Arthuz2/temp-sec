import { StyleSheet, View, useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Home } from './src/screens/home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
        <Home />
        <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      </View>
    </QueryClientProvider>
  );
}
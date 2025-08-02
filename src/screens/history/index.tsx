
import React from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useQuery } from '@tanstack/react-query';
import { getAllTemperature } from '../../api/getAllTemperature';
import { useTheme } from '../../hooks/useTheme';
import { LoadingScreen } from '../../components/loading-screen';
import styles from './styles';

interface DryingSession {
  id: string;
  startDate: Date;
  endDate: Date;
  avgTemperature: number;
  maxTemperature: number;
  minTemperature: number;
  duration: number; // em minutos
  status: 'completed' | 'interrupted' | 'ongoing';
}

// Gerar sessões baseadas nos dados reais
const generateSessionsFromData = (temperatures: any[]) => {
  if (!temperatures || temperatures.length === 0) return [];

  const sessions: DryingSession[] = [];
  const sortedTemps = [...temperatures].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());

  let currentSession: any[] = [];
  let sessionId = 1;

  for (let i = 0; i < sortedTemps.length; i++) {
    const current = sortedTemps[i];
    const currentTime = new Date(current.data).getTime();

    if (currentSession.length === 0) {
      currentSession.push(current);
    } else {
      const lastTime = new Date(currentSession[currentSession.length - 1].data).getTime();
      const timeDiff = (currentTime - lastTime) / (1000 * 60 * 60); // horas

      if (timeDiff > 2) {
        if (currentSession.length > 3) { // Mínimo 3 leituras para ser uma sessão
          const sessionTemps = currentSession.map(t => t.valor);
          const startDate = new Date(currentSession[0].data);
          const endDate = new Date(currentSession[currentSession.length - 1].data);
          const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

          sessions.push({
            id: sessionId.toString(),
            startDate,
            endDate,
            avgTemperature: Math.round((sessionTemps.reduce((a, b) => a + b, 0) / sessionTemps.length) * 10) / 10,
            maxTemperature: Math.max(...sessionTemps),
            minTemperature: Math.min(...sessionTemps),
            duration,
            status: duration > 180 ? 'completed' : 'interrupted' // > 3h = completa
          });
          sessionId++;
        }
        currentSession = [current];
      } else {
        currentSession.push(current);
      }
    }
  }

  if (currentSession.length > 3) {
    const sessionTemps = currentSession.map(t => t.valor);
    const startDate = new Date(currentSession[0].data);
    const endDate = new Date(currentSession[currentSession.length - 1].data);
    const duration = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));

    sessions.push({
      id: sessionId.toString(),
      startDate,
      endDate,
      avgTemperature: Math.round((sessionTemps.reduce((a, b) => a + b, 0) / sessionTemps.length) * 10) / 10,
      maxTemperature: Math.max(...sessionTemps),
      minTemperature: Math.min(...sessionTemps),
      duration,
      status: duration > 180 ? 'completed' : 'interrupted'
    });
  }

  return sessions.reverse(); // Mais recentes primeiro
};


export function History() {
  const theme = useTheme();

  const { data: temperatureData, isLoading } = useQuery({
    queryKey: ['allTemperatures'],
    queryFn: getAllTemperature,
    refetchInterval: 60000, // Atualizar a cada minuto
  });

  const sessions = temperatureData ? generateSessionsFromData(temperatureData) : [];

  if (isLoading) {
    return <LoadingScreen />;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'interrupted': return '#FF9800';
      case 'ongoing': return '#2196F3';
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'interrupted': return 'Interrompida';
      case 'ongoing': return 'Em andamento';
      default: return 'Desconhecido';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const renderSession = ({ item }: { item: DryingSession }) => (
    <TouchableOpacity
      style={[styles.sessionCard, { backgroundColor: theme.colors.surface }]}
      activeOpacity={0.7}
    >
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <Text style={[styles.sessionDate, { color: theme.colors.text }]}>
            {format(item.startDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </Text>
          <Text style={[styles.sessionTime, { color: theme.colors.textSecondary }]}>
            {format(item.startDate, 'HH:mm', { locale: ptBR })} - {format(item.endDate, 'HH:mm', { locale: ptBR })}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.sessionStats}>
        <View style={styles.statItem}>
          <Ionicons name="thermometer" size={16} color={theme.colors.primary} />
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Média</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.avgTemperature.toFixed(1)}°C</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="arrow-up" size={16} color="#FF6B6B" />
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Máx</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.maxTemperature.toFixed(1)}°C</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="arrow-down" size={16} color="#4ECDC4" />
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Mín</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{item.minTemperature.toFixed(1)}°C</Text>
        </View>

        <View style={styles.statItem}>
          <Ionicons name="time" size={16} color={theme.colors.primary} />
          <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Duração</Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{formatDuration(item.duration)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Histórico de Secagem</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {sessions.length} sessões registradas
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <View style={[styles.summaryItem, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
            {sessions.filter(s => s.status === 'completed').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Concluídas</Text>
        </View>

        <View style={[styles.summaryItem, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="time" size={24} color="#FF9800" />
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
            {sessions.filter(s => s.status === 'interrupted').length}
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Interrompidas</Text>
        </View>

        <View style={[styles.summaryItem, { backgroundColor: theme.colors.surface }]}>
          <Ionicons name="thermometer" size={24} color={theme.colors.primary} />
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
            {sessions.length > 0 ? (sessions.reduce((acc, s) => acc + s.avgTemperature, 0) / sessions.length).toFixed(1) : '0.0'}°C
          </Text>
          <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Temp. Média</Text>
        </View>
      </View>

      {sessions.length > 0 ? (
        <FlatList
          data={sessions}
          renderItem={renderSession}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.sessionsList}
        />
      ) : (
        <View style={styles.noSessionsContainer}>
          <Ionicons name="hourglass-outline" size={60} color={theme.colors.textSecondary} />
          <Text style={[styles.noSessionsText, { color: theme.colors.text }]}>
            Nenhuma sessão encontrada
          </Text>
          <Text style={[styles.noSessionsSubtext, { color: theme.colors.textSecondary }]}>
            As sessões aparecerão automaticamente com base nos dados de temperatura
          </Text>
        </View>
      )}
    </View>
  );
}
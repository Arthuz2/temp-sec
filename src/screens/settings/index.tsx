
import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../contexts/SettingsContext';
import styles from './styles';

export function Settings() {
  const theme = useTheme();
  const {
    temperatureLimits,
    temperatureUnit,
    readingInterval,
    darkMode,
    updateTemperatureLimits,
    updateTemperatureUnit,
    updateReadingInterval,
    toggleDarkMode,
  } = useSettings();

  const [minTemp, setMinTemp] = useState(temperatureLimits.min.toString());
  const [maxTemp, setMaxTemp] = useState(temperatureLimits.max.toString());
  const [idealMinTemp, setIdealMinTemp] = useState(temperatureLimits.ideal.min.toString());
  const [idealMaxTemp, setIdealMaxTemp] = useState(temperatureLimits.ideal.max.toString());

  const intervalOptions = [
    { label: '10 segundos', value: 10000 },
    { label: '30 segundos', value: 30000 },
    { label: '1 minuto', value: 60000 },
    { label: '2 minutos', value: 120000 },
    { label: '5 minutos', value: 300000 },
  ];

  const showIntervalSelector = () => {
    const options = intervalOptions.map(option => ({
      text: option.label,
      onPress: () => updateReadingInterval(option.value)
    }));

    Alert.alert(
      'Intervalo de Leitura',
      'Escolha o intervalo para leituras do sensor:',
      [
        ...options,
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const getCurrentInterval = () => {
    const current = intervalOptions.find(option => option.value === readingInterval);
    return current ? current.label : '30 segundos';
  };

  const saveLimits = () => {
    const newLimits = {
      min: parseFloat(minTemp) || 15,
      max: parseFloat(maxTemp) || 45,
      ideal: {
        min: parseFloat(idealMinTemp) || 35,
        max: parseFloat(idealMaxTemp) || 40
      }
    };

    if (newLimits.min >= newLimits.max) {
      Alert.alert('Erro', 'A temperatura mínima deve ser menor que a máxima');
      return;
    }

    if (newLimits.ideal.min >= newLimits.ideal.max) {
      Alert.alert('Erro', 'A faixa ideal mínima deve ser menor que a máxima');
      return;
    }

    updateTemperatureLimits(newLimits);
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Configurações
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Seção Exportação */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Exportação de Dados
          </Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {/* TODO: Implementar exportação CSV */ }}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="document-text" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Exportar como CSV
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Baixar dados em formato de planilha
                </Text>
              </View>
            </View>
            <Ionicons name="download" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => {/* TODO: Implementar relatório PDF */ }}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="document" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Gerar Relatório
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Relatório completo em HTML
                </Text>
              </View>
            </View>
            <Ionicons name="share" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Seção Aparência */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Aparência
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <Ionicons
                name={darkMode ? "moon" : "sunny"}
                size={20}
                color={theme.colors.text}
              />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Modo Escuro
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  {darkMode ? 'Tema escuro ativado' : 'Tema claro ativado'}
                </Text>
              </View>
            </View>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={darkMode ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>
        </View>

        {/* Seção Temperatura */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Configurações de Temperatura
          </Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => updateTemperatureUnit(temperatureUnit === '°C' ? '°F' : '°C')}
          >
            <View style={styles.settingInfo}>
              <Ionicons name="thermometer" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Unidade de Temperatura
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  Atual: {temperatureUnit}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={showIntervalSelector}>
            <View style={styles.settingInfo}>
              <Ionicons name="time" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Intervalo de Leitura
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  {getCurrentInterval()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Seção Limites */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Limites de Temperatura
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Faixa Operacional
            </Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Text style={[styles.inputPrefix, { color: theme.colors.textSecondary }]}>
                  Min:
                </Text>
                <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                  {temperatureLimits.min}°C
                </Text>
              </View>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Text style={[styles.inputPrefix, { color: theme.colors.textSecondary }]}>
                  Max:
                </Text>
                <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                  {temperatureLimits.max}°C
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
              Faixa Ideal
            </Text>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Text style={[styles.inputPrefix, { color: theme.colors.textSecondary }]}>
                  Min:
                </Text>
                <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                  {temperatureLimits.ideal.min}°C
                </Text>
              </View>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Text style={[styles.inputPrefix, { color: theme.colors.textSecondary }]}>
                  Max:
                </Text>
                <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                  {temperatureLimits.ideal.max}°C
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seção Sobre */}
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Sobre o App
          </Text>

          <View style={styles.aboutInfo}>
            <Text style={[styles.appName, { color: theme.colors.text }]}>
              TempSec - Monitor de Secagem
            </Text>
            <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
              Versão 1.0.0
            </Text>
            <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>
              Aplicativo para monitoramento de temperatura durante processos de secagem agrícola.
            </Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSettings } from '../../contexts/SettingsContext';
import { useQuery } from '@tanstack/react-query';
import { getAllTemperature } from '../../api/getAllTemperature';
import { exportToCSV, generatePDFReport } from '../../utils/exportData';
import styles from './styles';

export function Settings() {
  const theme = useTheme();
  const {
    temperatureLimits,
    temperatureUnit,
    readingInterval,
    sessionDuration,
    darkMode,
    updateTemperatureLimits,
    updateTemperatureUnit,
    updateReadingInterval,
    updateSessionDuration,
    toggleDarkMode,
  } = useSettings();

  const celsiusToFahrenheit = (celsius: number) => (celsius * 9 / 5) + 32;
  const fahrenheitToCelsius = (fahrenheit: number) => (fahrenheit - 32) * 5 / 9;

  const getDisplayTemp = (temp: number) =>
    temperatureUnit === '°F' ? celsiusToFahrenheit(temp) : temp;

  const [minTemp, setMinTemp] = useState(getDisplayTemp(temperatureLimits.min).toFixed(1));
  const [maxTemp, setMaxTemp] = useState(getDisplayTemp(temperatureLimits.max).toFixed(1));
  const [idealMinTemp, setIdealMinTemp] = useState(getDisplayTemp(temperatureLimits.ideal.min).toFixed(1));
  const [idealMaxTemp, setIdealMaxTemp] = useState(getDisplayTemp(temperatureLimits.ideal.max).toFixed(1));
  const [isEditing, setIsEditing] = useState(false);

  const { data: allTemperatures } = useQuery({
    queryKey: ['allTemperatures'],
    queryFn: getAllTemperature,
    enabled: false, // Só carrega quando necessário
  });

  useEffect(() => {
    setMinTemp(getDisplayTemp(temperatureLimits.min).toFixed(1));
    setMaxTemp(getDisplayTemp(temperatureLimits.max).toFixed(1));
    setIdealMinTemp(getDisplayTemp(temperatureLimits.ideal.min).toFixed(1));
    setIdealMaxTemp(getDisplayTemp(temperatureLimits.ideal.max).toFixed(1));
  }, [temperatureUnit, temperatureLimits]);

  const intervalOptions = [
    { label: '10 segundos', value: 10000 },
    { label: '30 segundos', value: 30000 },
    { label: '1 minuto', value: 60000 },
    { label: '2 minutos', value: 120000 },
    { label: '5 minutos', value: 300000 },
  ];

  const sessionDurationOptions = [
    { label: '1 hora', value: 60 },
    { label: '2 horas', value: 120 },
    { label: '3 horas', value: 180 },
    { label: '4 horas', value: 240 },
    { label: '6 horas', value: 360 },
    { label: '8 horas', value: 480 },
    { label: '12 horas', value: 720 },
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

  const showSessionDurationSelector = () => {
    const options = sessionDurationOptions.map(option => ({
      text: option.label,
      onPress: () => updateSessionDuration(option.value)
    }));

    Alert.alert(
      'Duração da Sessão',
      'Escolha a duração mínima para considerar uma sessão completa:',
      [
        ...options,
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const getCurrentSessionDuration = () => {
    const current = sessionDurationOptions.find(option => option.value === sessionDuration);
    return current ? current.label : '3 horas';
  };

  const saveLimits = () => {
    const convertToStorage = (temp: number) =>
      temperatureUnit === '°F' ? fahrenheitToCelsius(temp) : temp;

    const newLimits = {
      min: convertToStorage(parseFloat(minTemp) || (temperatureUnit === '°F' ? 59 : 15)),
      max: convertToStorage(parseFloat(maxTemp) || (temperatureUnit === '°F' ? 113 : 45)),
      ideal: {
        min: convertToStorage(parseFloat(idealMinTemp) || (temperatureUnit === '°F' ? 95 : 35)),
        max: convertToStorage(parseFloat(idealMaxTemp) || (temperatureUnit === '°F' ? 104 : 40))
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
    setIsEditing(false);
    Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
  };

  const handleExportCSV = async () => {
    if (!allTemperatures || allTemperatures.length === 0) {
      Alert.alert('Aviso', 'Não há dados para exportar');
      return;
    }

    const result = await exportToCSV(allTemperatures, []);
    if (result && result.success) {
      Alert.alert('Sucesso', `Dados exportados${'fileName' in result && result.fileName ? ` como ${result.fileName}` : ''}`);
    } else if (result) {
      Alert.alert('Erro', `Falha ao exportar: ${result.error}`);
    } else {
      Alert.alert('Erro', 'Falha ao exportar: resultado indefinido');
    }
  };

  const handleGenerateReport = async () => {
    if (!allTemperatures || allTemperatures.length === 0) {
      Alert.alert('Aviso', 'Não há dados para gerar relatório');
      return;
    }

    const result = await generatePDFReport(allTemperatures, []);
    if (result.success) {
      Alert.alert('Sucesso', `Relatório gerado como ${result.fileName}`);
    } else {
      Alert.alert('Erro', `Falha ao gerar relatório: ${result.error}`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Configurações
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Exportação de Dados
          </Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportCSV}
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
            onPress={handleGenerateReport}
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

          <TouchableOpacity style={styles.settingItem} onPress={showSessionDurationSelector}>
            <View style={styles.settingInfo}>
              <Ionicons name="hourglass" size={20} color={theme.colors.text} />
              <View style={styles.settingText}>
                <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
                  Duração da Sessão
                </Text>
                <Text style={[styles.settingDescription, { color: theme.colors.textSecondary }]}>
                  {getCurrentSessionDuration()}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Limites de Temperatura
          </Text>

          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Faixa Operacional
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editButton}
              >
                <Ionicons
                  name={isEditing ? "checkmark" : "pencil"}
                  size={16}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputRow}>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Text style={[styles.inputPrefix, { color: theme.colors.textSecondary }]}>
                  Min:
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.inputField, { color: theme.colors.text }]}
                    value={minTemp}
                    onChangeText={setMinTemp}
                    keyboardType="numeric"
                    placeholder={temperatureUnit === '°F' ? "59" : "15"}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                ) : (
                  <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                    {getDisplayTemp(temperatureLimits.min).toFixed(1)}{temperatureUnit}
                  </Text>
                )}
              </View>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Text style={[styles.inputPrefix, { color: theme.colors.textSecondary }]}>
                  Max:
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.inputField, { color: theme.colors.text }]}
                    value={maxTemp}
                    onChangeText={setMaxTemp}
                    keyboardType="numeric"
                    placeholder={temperatureUnit === '°F' ? "113" : "45"}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                ) : (
                  <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                    {getDisplayTemp(temperatureLimits.max).toFixed(1)}{temperatureUnit}
                  </Text>
                )}
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
                {isEditing ? (
                  <TextInput
                    style={[styles.inputField, { color: theme.colors.text }]}
                    value={idealMinTemp}
                    onChangeText={setIdealMinTemp}
                    keyboardType="numeric"
                    placeholder={temperatureUnit === '°F' ? "95" : "35"}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                ) : (
                  <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                    {getDisplayTemp(temperatureLimits.ideal.min).toFixed(1)}{temperatureUnit}
                  </Text>
                )}
              </View>
              <View style={[styles.inputContainer, { borderColor: theme.colors.border }]}>
                <Text style={[styles.inputPrefix, { color: theme.colors.textSecondary }]}>
                  Max:
                </Text>
                {isEditing ? (
                  <TextInput
                    style={[styles.inputField, { color: theme.colors.text }]}
                    value={idealMaxTemp}
                    onChangeText={setIdealMaxTemp}
                    keyboardType="numeric"
                    placeholder={temperatureUnit === '°F' ? "104" : "40"}
                    placeholderTextColor={theme.colors.textSecondary}
                  />
                ) : (
                  <Text style={[styles.inputValue, { color: theme.colors.text }]}>
                    {getDisplayTemp(temperatureLimits.ideal.max).toFixed(1)}{temperatureUnit}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
              onPress={saveLimits}
            >
              <Ionicons name="save" size={20} color="white" />
              <Text style={styles.saveButtonText}>
                Salvar Configurações
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Sobre o App
          </Text>

          <View style={styles.aboutInfo}>
            <Text style={[styles.appName, { color: theme.colors.text }]}>
              TempSec - Monitor de Temperatura
            </Text>
            <Text style={[styles.appVersion, { color: theme.colors.textSecondary }]}>
              Versão 1.0.0
            </Text>
            <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>
              Aplicativo para monitoramento de temperatura.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

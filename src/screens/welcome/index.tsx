
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const tutorialSteps = [
    {
      icon: 'thermometer',
      title: 'Monitoramento em Tempo Real',
      description: 'Acompanhe a temperatura da sua secagem em tempo real com gráficos e alertas.'
    },
    {
      icon: 'analytics',
      title: 'Histórico Completo',
      description: 'Visualize o histórico de todas as suas sessões de secagem anteriores.'
    },
    {
      icon: 'notifications',
      title: 'Alertas Inteligentes',
      description: 'Receba notificações quando a temperatura sair da faixa ideal.'
    },
    {
      icon: 'settings',
      title: 'Configurações Personalizadas',
      description: 'Configure limites de temperatura, unidades e modo escuro/claro.'
    }
  ];

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const skipTutorial = () => {
    onComplete();
  };

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>TempSec</Text>
          <Text style={styles.subtitle}>Monitoramento de Temperatura</Text>
        </View>

        <ScrollView contentContainerStyle={styles.tutorialContent} showsVerticalScrollIndicator={false}>
          <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={tutorialSteps[currentStep].icon as any}
                size={80}
                color="white"
              />
            </View>

            <Text style={styles.stepTitle}>
              {tutorialSteps[currentStep].title}
            </Text>

            <Text style={styles.stepDescription}>
              {tutorialSteps[currentStep].description}
            </Text>
          </View>

          <View style={styles.indicators}>
            {tutorialSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  { backgroundColor: index === currentStep ? 'white' : 'rgba(255,255,255,0.3)' }
                ]}
              />
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={skipTutorial} style={styles.skipButton}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
            <Text style={styles.nextText}>
              {currentStep === tutorialSteps.length - 1 ? 'Começar' : 'Próximo'}
            </Text>
            <Ionicons
              name={currentStep === tutorialSteps.length - 1 ? 'checkmark' : 'arrow-forward'}
              size={16}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

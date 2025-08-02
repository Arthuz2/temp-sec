import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import styles from './styles';

export type TabName = 'home' | 'history' | 'alerts' | 'settings';

interface TabBarProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const tabs = [
  { name: 'home' as TabName, icon: 'home', label: 'Início' },
  { name: 'history' as TabName, icon: 'time', label: 'Histórico' },
  { name: 'alerts' as TabName, icon: 'notifications', label: 'Alertas' },
  { name: 'settings' as TabName, icon: 'settings', label: 'Config' },
];

export function TabBar({ activeTab, onTabPress }: TabBarProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => onTabPress(tab.name)}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={activeTab === tab.name ? theme.colors.primary : theme.colors.textSecondary}
          />
          <Text
            style={[
              styles.tabLabel,
              { color: activeTab === tab.name ? theme.colors.primary : theme.colors.textSecondary }
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
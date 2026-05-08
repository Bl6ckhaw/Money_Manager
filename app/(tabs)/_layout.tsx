import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
import { useSettings } from '../../context/settingsContext';

export default function Layout() {
  const { theme } = useSettings();
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: theme.bgTabs },
      headerTitleStyle: { color: theme.textTabs },
      tabBarStyle: { backgroundColor: theme.bgTabs },
      tabBarActiveTintColor: theme.primary,
      tabBarInactiveTintColor: theme.textTabsSecondary,
    }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Transactions' }} />
      <Tabs.Screen name="graph" options={{ title: 'Graph' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}
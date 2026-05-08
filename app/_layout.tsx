import { Slot } from 'expo-router';
import { TransactionsProvider } from '../context/transactionsContext';
import { useTransactions } from '../context/transactionsContext';
import { View, ActivityIndicator } from 'react-native';
import Settings from './(tabs)/settings';
import { SettingsProvider } from '../context/settingsContext';

function AppContent() {
  const { isLoading } = useTransactions();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }
  return <Slot />;
}

export default function Layout() {
  return (
    <SettingsProvider>
      <TransactionsProvider>
        <AppContent />
      </TransactionsProvider>
    </SettingsProvider>
  );
}
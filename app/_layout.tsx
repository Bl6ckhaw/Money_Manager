import { Slot } from 'expo-router';
import { TransactionsProvider } from '../context/transactionsContext';

export default function Layout() {
  return (
    <TransactionsProvider>
      <Slot />
    </TransactionsProvider>
  );
}
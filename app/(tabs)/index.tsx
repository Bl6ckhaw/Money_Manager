import { View, Text, StyleSheet } from 'react-native';
import { useTransactions } from '../../context/transactionsContext';
import { useMemo } from 'react';

export default function Home() {
  const { transactions } = useTransactions();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = useMemo(
    () => transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }),
    [transactions]
  );

  const totalIncome = useMemo(
    () => monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const totalExpenses = useMemo(
    () => monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0),
    [monthlyTransactions]
  );

  const balance = totalIncome - totalExpenses;
  const isPositive = balance >= 0;

  const monthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <View style={styles.container}>

        <Text style={styles.title}>Welcome Back !</Text>

      {/* Balance card */}
      <View style={[styles.balanceCard, isPositive ? styles.balancePositive : styles.balanceNegative]}>
        <Text style={styles.monthLabel}>{monthName}</Text>
        <Text style={styles.balanceAmount}>
          {isPositive ? '+' : ''}{balance.toFixed(2)}€
        </Text>
        <Text style={styles.balanceSubtitle}>Current balance</Text>
      </View>

      {/* Income / Expenses row */}
      <View style={styles.row}>

        <View style={[styles.card, styles.incomeCard]}>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={[styles.cardAmount, styles.incomeAmount]}>
            +{totalIncome.toFixed(2)}€
          </Text>
        </View>

        <View style={[styles.card, styles.expenseCard]}>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={[styles.cardAmount, styles.expenseAmount]}>
            -{totalExpenses.toFixed(2)}€
          </Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  balanceCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  balancePositive: {
    backgroundColor: '#6366f1',
  },
  balanceNegative: {
    backgroundColor: '#ef4444',
  },
  monthLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'capitalize',
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
  },
  balanceSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    gap: 8,
    backgroundColor: '#fff',
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  cardLabel: {
    fontSize: 13,
    color: '#888',
    fontWeight: '600',
  },
  cardAmount: {
    fontSize: 22,
    fontWeight: '700',
  },
  incomeAmount: {
    color: '#22c55e',
  },
  expenseAmount: {
    color: '#ef4444',
  },
});
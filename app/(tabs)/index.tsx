import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTransactions } from '../../context/transactionsContext';
import { useMemo } from 'react';
import ExpenseBar from '../components/ExpenseBar';
import RecentTransactions from '../components/RecentTransactions';

export default function Home() {
  const { transactions, getTransactionsForMonth } = useTransactions();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = useMemo(
    () => getTransactionsForMonth(currentMonth, currentYear) ?? [],
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
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {/* Balance card */}
      <View style={[styles.balanceCard, isPositive ? styles.balancePositive : styles.balanceNegative]}>
        <Text style={styles.monthLabel}>{monthName}</Text>
        <Text style={styles.balanceAmount}>
          {isPositive ? '+' : ''}{balance.toFixed(2)}€
        </Text>
        <Text style={styles.balanceSubtitle}>Current balance</Text>

        {/* Income / Expenses row inside the card */}
        <View style={styles.row}>
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Income</Text>
            <Text style={styles.miniAmount}>+{totalIncome.toFixed(2)}€</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.miniCard}>
            <Text style={styles.miniLabel}>Expenses</Text>
            <Text style={styles.miniAmount}>-{totalExpenses.toFixed(2)}€</Text>
          </View>
        </View>
      </View>

      {/* Expense bar */}
      <ExpenseBar transactions={monthlyTransactions} />

      {/* Recent transactions */}
      <RecentTransactions transactions={monthlyTransactions} />

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    padding: 20,
    gap: 16,
  },
  balanceCard: {
    borderRadius: 20,
    padding: 24,
    gap: 8,
    alignItems: 'center',
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    marginTop: 8,
  },
  miniCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 8,
  },
  miniLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
  miniAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
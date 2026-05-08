import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTransactions } from '../../context/transactionsContext';
import { useMemo } from 'react';
import ExpenseBar from '../components/ExpenseBar';
import RecentTransactions from '../components/RecentTransactions';
import { useSettings } from '../../context/settingsContext';

export default function Home() {
  const { transactions, getTransactionsForMonth } = useTransactions();
  const { theme } = useSettings();

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
      style={[styles.scroll, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.container}
    >
      {/* Balance card */}
      <View
        style={[
          styles.balanceCard,
          { backgroundColor: isPositive ? theme.primary : theme.expense },
        ]}
      >
        <Text style={[styles.monthLabel, { color: theme.background }]}>{monthName}</Text>
        <Text style={[styles.balanceAmount, { color: theme.background }]}>
          {isPositive ? '+' : ''}{balance.toFixed(2)}€
        </Text>
        <Text style={[styles.balanceSubtitle, { color: theme.background }]}>Current balance</Text>

        {/* Income / Expenses row inside the card */}
        <View style={[styles.row, { backgroundColor: theme.cardHighlight }]}>
          <View style={styles.miniCard}>
            <Text style={[styles.miniLabel, { color: theme.background }]}>Income</Text>
            <Text style={[styles.miniAmount, { color: theme.background }]}>+{totalIncome.toFixed(2)}€</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: theme.cardHighlight }]} />
          <View style={styles.miniCard}>
            <Text style={[styles.miniLabel, { color: theme.background }]}>Expenses</Text>
            <Text style={[styles.miniAmount, { color: theme.background }]}>-{totalExpenses.toFixed(2)}€</Text>
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
  monthLabel: {
    fontSize: 14,
    textTransform: 'capitalize',
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: '800',
  },
  balanceSubtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
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
    marginHorizontal: 8,
  },
  miniLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  miniAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
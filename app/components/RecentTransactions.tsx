import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Transactions } from '../../types/transactions';
import TransactionsItem from './TransactionsItem';
import { useSettings } from '../../context/settingsContext';

interface Props {
  transactions: Transactions[];
}

export default function RecentTransactions({ transactions }: Props) {
  const router = useRouter();
  const { theme } = useSettings();

  const recent = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textSecondary }]}>Recent</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={[styles.seeAll, { color: theme.primary }]}>See all →</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {recent.length === 0 ? (
        <Text style={[styles.empty, { color: theme.textTertiary }]}>No transactions this month</Text>
      ) : (
        recent.map((t) => (
          <TransactionsItem key={t.id} transactions={t} isCurrentMonth={true} />
        ))
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    fontSize: 13,
    textAlign: 'center',
    padding: 20,
  },
});
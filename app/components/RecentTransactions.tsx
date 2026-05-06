import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Transactions } from '../../types/transactions';
import TransactionItem from './TransactionsItem';

interface Props {
  transactions: Transactions[];
}

export default function RecentTransactions({ transactions }: Props) {
  const router = useRouter();

  const recent = transactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recent</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
          <Text style={styles.seeAll}>See all →</Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      {recent.length === 0 ? (
        <Text style={styles.empty}>No transactions this month</Text>
      ) : (
        recent.map((t) => (
          <TransactionItem key={t.id} transactions={t} />
        ))
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
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
    color: '#888',
  },
  seeAll: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },
  empty: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
    padding: 20,
  },
});
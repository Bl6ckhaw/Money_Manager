import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTransactions } from '../../context/transactionsContext';
import { CATEGORY_COLORS, TransactionCategory } from '../../types/transactions';

export default function GraphScreen() {
  const { transactions = [] } = useTransactions();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = useMemo(
    () => (transactions?? []).filter((t) => {
      const date = new Date(t.date);
      return (
        t.type === 'expense' &&
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    }),
    [transactions]
  );

  const grouped = useMemo(() => {
    const map: Partial<Record<TransactionCategory, number>> = {};

    (monthlyExpenses ?? []).forEach((t) => {
        if (!t?.category) return;

        map[t.category] = (map[t.category] ?? 0) + (t.amount ?? 0);
    });

    return map;
    }, [monthlyExpenses]);


  const total = useMemo(
    () => Object.values(grouped ?? {}).reduce((sum, v) => sum + (v ?? 0), 0),
    [grouped]
  );

  

  const pieData = useMemo(
    () => Object.entries(grouped ?? {}).map(([cat, amount]) => ({
      value: amount ?? 0,
      color: CATEGORY_COLORS[cat as TransactionCategory],
      label: cat,
      percentage: total > 0 ? ((amount ?? 0) / total * 100).toFixed(1) : '0',
    })),
    [grouped, total]
  );

  // Empty state
  if (pieData.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No expenses this month</Text>
      </View>
    );
  }
    

  return (
    <View style={styles.container}>

      {/* Title */}
      <Text style={styles.title}>Expenses by category</Text>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          radius={120}
          innerRadius={70}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.centerAmount}>{total.toFixed(0)}€</Text>
              <Text style={styles.centerSub}>total</Text>
            </View>
          )}
        />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {pieData.map((item) => (
          <View key={item.label} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel}>{item.label}</Text>
            <Text style={styles.legendPercent}>{item.percentage}%</Text>
            <Text style={styles.legendAmount}>{item.value.toFixed(2)}€</Text>
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    gap: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  chartContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: '#222',
  },
  centerSub: {
    fontSize: 13,
    color: '#888',
  },
  legend: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    textTransform: 'capitalize',
  },
  legendPercent: {
    fontSize: 13,
    color: '#888',
    width: 45,
    textAlign: 'right',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    width: 70,
    textAlign: 'right',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#aaa',
  },
});
import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTransactions } from '../../context/transactionsContext';
import { TransactionCategory } from '../../types/transactions';
import { useSettings } from '../../context/settingsContext';
import MonthlyBarChart from '../components/MonthlyBarChart';

const { width } = Dimensions.get('window');

function getMonthShortName(month: number): string {
  return new Date(2026, month, 1).toLocaleString('default', { month: 'short' });
}

export default function GraphScreen() {
  const { transactions, selectedMonth, selectedYear, getTransactionsForMonth } = useTransactions();
  const { theme, categoryColors } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  const monthlyExpenses = useMemo(
    () => getTransactionsForMonth(selectedMonth, selectedYear)
      .filter(t => t.type === 'expense'),
    [transactions, selectedMonth, selectedYear]
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
      color: categoryColors [cat as TransactionCategory],
      label: cat,
      percentage: total > 0 ? ((amount ?? 0) / total * 100).toFixed(1) : '0',
    })),
    [grouped, total, categoryColors]
  );

  // Empty state
  if (pieData.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.background }]}>
        <Text style={[styles.emptyText, { color: theme.textTertiary }]}>No expenses this month</Text>
      </View>
    );
  }

  const charts = [
    {
      id: 'pie',
      title: 'Expenses by category',
      component: (
        <View style={[styles.chartContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Expenses by category</Text>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={pieData}
              donut
              radius={120}
              innerRadius={70}
              innerCircleColor={theme.background}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={[styles.centerAmount, { color: theme.text }]}>{total.toFixed(2)}€</Text>
                  <Text style={[styles.centerSub, { color: theme.textSecondary }]}>total</Text>
                </View>
              )}
            />
          </View>

          {/* Legend */}
          <View style={[styles.legend, { backgroundColor: theme.card }]}>
            {pieData.map((item) => (
              <View key={item.label} style={styles.legendRow}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={[styles.legendLabel, { color: theme.text }]}>{item.label}</Text>
                <Text style={[styles.legendPercent, { color: theme.textSecondary }]}>{item.percentage}%</Text>
                <Text style={[styles.legendAmount, { color: theme.text }]}>{item.value.toFixed(2)}€</Text>
              </View>
            ))}
          </View>
        </View>
      ),
    },
    {
      id: 'bar',
      title: 'Monthly expenses',
      component: <MonthlyBarChart />,
    },
  ];

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* FlatList Carousel */}
      <FlatList
        data={charts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width }}>
            {item.component}
          </View>
        )}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
      />

      {/* Dots Indicator */}
      <View style={styles.dotsContainer}>
        {charts.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentIndex ? theme.primary : theme.textTabsSecondary,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  chartContainer: {
    padding: 20,
    gap: 24,
  },
  pieChartContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerAmount: {
    fontSize: 24,
    fontWeight: '800',
  },
  centerSub: {
    fontSize: 13,
  },
  legend: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  legendPercent: {
    fontSize: 13,
    width: 45,
    textAlign: 'right',
  },
  legendAmount: {
    fontSize: 14,
    fontWeight: '600',
    width: 70,
    textAlign: 'right',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { useTransactions } from '../../context/transactionsContext';
import { TransactionCategory } from '../../types/transactions';
import { useSettings } from '../../context/settingsContext';
import MonthlyBarChart from '../components/MonthlyBarChart';
import CustomRangeModal from '../components/CustomRangeModal';

const { width } = Dimensions.get('window');

function getMonthShortName(month: number): string {
  return new Date(2026, month, 1).toLocaleString('default', { month: 'short' });
}

function getMonthName(month: number, year: number): string {
  return new Date(year, month, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
}

export default function GraphScreen() {
  const { transactions, selectedMonth, selectedYear, getTransactionsForMonth } = useTransactions();
  const { theme, categoryColors } = useSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ range, setRange ] = useState<'1 month' | '3 months' | '12 months' | 'custom'>('1 month');
  const [ customStart, setCustomStart ] = useState({ month: selectedMonth, year: selectedYear });
  const [ customEnd, setCustomEnd ] = useState({ month: selectedMonth, year: selectedYear });
  const [ customModalVisible, setCustomModalVisible ] = useState(false);

  const rangeLabel = useMemo(() => {
    if (range === '1 month') {
      return getMonthName(selectedMonth, selectedYear);
    }
    if (range === '3 months') {
      const start = selectedMonth - 2 < 0
        ? { month: selectedMonth + 10, year: selectedYear - 1 }
        : { month: selectedMonth - 2, year: selectedYear };
      return `${getMonthName(start.month, start.year)} — ${getMonthName(selectedMonth, selectedYear)}`;
    }
    if (range === '12 months') {
      const now = new Date();
      const start = now.getMonth() - 11 < 0
        ? { month: now.getMonth() + 1, year: now.getFullYear() - 1 }
        : { month: now.getMonth() - 11, year: now.getFullYear() };
      return `${getMonthName(start.month, start.year)} — ${getMonthName(now.getMonth(), now.getFullYear())}`;
    }
    if (range === 'custom') {
      return `${getMonthName(customStart.month, customStart.year)} — ${getMonthName(customEnd.month, customEnd.year)}`;
    }
    return '';
  }, [range, selectedMonth, selectedYear, customStart, customEnd]);

  const getTransactionsForRange = useMemo(() => {
    const now = new Date();

    let months: { month: number; year: number }[] = [];

    if (range === '1 month') {
      months = [{ month: selectedMonth, year: selectedYear }];
    }

    if (range === '3 months') {
      for (let i = 2; i >= 0; i--) {
        let m = selectedMonth - i;
        let y = selectedYear;
        if (m < 0) { m += 12; y -= 1; }
        months.push({ month: m, year: y });
      }
    }

    if (range === '12 months') {
      for (let i = 11; i >= 0; i--) {
        let m = now.getMonth() - i;
        let y = now.getFullYear();
        if (m < 0) { m += 12; y -= 1; }
        months.push({ month: m, year: y });
      }
    }

    if (range === 'custom') {
      const startTime = customStart.year * 12 + customStart.month;
      const endTime = customEnd.year * 12 + customEnd.month;
      for (let t = startTime; t <= endTime; t++) {
        months.push({ month: t % 12, year: Math.floor(t / 12) });
      }
    }

    // merge all transactions across months
    const allTransactions = months.flatMap(({ month, year }) =>
      getTransactionsForMonth(month, year)
    );

    // deduplicate recurring — keep unique id
    const seen = new Set<string>();
    return allTransactions.filter(t => {
      if (seen.has(t.id)) return false;
      seen.add(t.id);
      return true;
    });

  }, [range, selectedMonth, selectedYear, customStart, customEnd, transactions]);

  const monthlyExpenses = useMemo(
    () => getTransactionsForRange.filter(t => t.type === 'expense'),
    [getTransactionsForRange]
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
          {/* Range selector */}
          <View style={[styles.rangeSelector, { backgroundColor: theme.card }]}>
            {(['1 month', '3 months', '12 months', 'custom'] as const).map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.rangeBtn,
                  range === r && { backgroundColor: theme.primary },
                ]}
                onPress={() => r === 'custom'
                  ? setCustomModalVisible(true)
                  : setRange(r)
                }
              >
                <Text style={[
                  styles.rangeBtnText,
                  { color: range === r ? theme.background : theme.textSecondary },
                ]}>
                  {r === 'custom' ? '⚙' : r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Range label */}
          <Text style={[styles.rangeLabel, { color: theme.textSecondary }]}>
            {rangeLabel}
          </Text>
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
          <CustomRangeModal
            visible={customModalVisible}
            onClose={() => setCustomModalVisible(false)}
            onConfirm={(start, end) => {
              setCustomStart(start);
              setCustomEnd(end);
              setRange('custom');
            }}
            initialStart={customStart}
            initialEnd={customEnd}
          />

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
  rangeSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  rangeBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
  rangeLabel: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
});
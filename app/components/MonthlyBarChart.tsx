import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTransactions } from '../../context/transactionsContext';
import { useSettings } from '../../context/settingsContext';
import { useMemo, useState } from 'react';
import transactions from '../(tabs)/transactions';

const { width } = Dimensions.get('window');

export default function MonthlyBarChart() {
  const { getTransactionsForMonth } = useTransactions();
  const { theme } = useSettings();
  const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear());
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const monthlyData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      // block future months only if viewing current year
      if (selectedYear === currentYear && i > currentMonth) return {
        value: 0,
        label: getMonthShortName(i),
        frontColor: theme.border,
        labelTextStyle: { color: theme.textSecondary, fontSize: 11 },
      };

      const transactions = getTransactionsForMonth(i, selectedYear);
      const total = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        value: total,
        label: getMonthShortName(i),
        frontColor: i === currentMonth && selectedYear === currentYear
          ? theme.primary
          : theme.textTertiary,
        labelTextStyle: { color: theme.textSecondary, fontSize: 11 },
      };
    });
  }, [selectedYear, currentMonth, currentYear, theme, transactions]);

  const maxValue = Math.max(...monthlyData.map(d => d.value), 1);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>Monthly expenses</Text>

        {/* Year navigator placed inline with title */}
        <View style={styles.yearNav}>
          <TouchableOpacity
            onPress={() => setSelectedYear(y => y - 1)}
            style={styles.arrow}
          >
            <Text style={[styles.arrowText, { color: theme.primary }]}>‹</Text>
          </TouchableOpacity>

          <Text style={[styles.yearText, { color: theme.text }]}>{selectedYear}</Text>

          <TouchableOpacity
            onPress={() => setSelectedYear(y => y + 1)}
            style={styles.arrow}
            disabled={selectedYear >= currentYear}
          >
            <Text style={[
              styles.arrowText,
              { color: selectedYear >= currentYear ? theme.border : theme.primary }
            ]}>
              ›
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Current month highlighted
      </Text>

      <View style={[styles.chartCard, { backgroundColor: theme.card }]}>
        <BarChart
          data={monthlyData}
          width={width - 100}
          height={200}
          maxValue={maxValue}
          noOfSections={4}
          barWidth={18}
          spacing={8}
          roundedTop
          hideRules
          xAxisColor={theme.border}
          yAxisColor={theme.border}
          yAxisTextStyle={{ color: theme.textSecondary, fontSize: 10 }}
          showValuesAsTopLabel
          topLabelTextStyle={{ color: theme.textSecondary, fontSize: 9 }}
        />
      </View>

    </View>
  );
}

function getMonthShortName(month: number): string {
  return new Date(2026, month, 1).toLocaleString('default', { month: 'short' });
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  yearText: {
    fontSize: 16,
    fontWeight: '700',
    marginHorizontal: 8,
  },
  subtitle: {
    fontSize: 13,
    marginBottom: 8,
  },
  chartCard: {
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 16,
    alignItems: 'center',
  },
  yearNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  arrow: {
    padding: 8,
    width: 36,
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 28,
    fontWeight: '600',
  }
});
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { useTransactions } from '../../context/transactionsContext';
import { useSettings } from '../../context/settingsContext';
import { useMemo } from 'react';

const { width } = Dimensions.get('window');

export default function MonthlyBarChart() {
  const { getTransactionsForMonth } = useTransactions();
  const { theme } = useSettings();

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const monthlyData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      // dont compute future months
      if (i > currentMonth) return {
        value: 0,
        label: getMonthShortName(i),
        frontColor: theme.border,
        labelTextStyle: { color: theme.textSecondary, fontSize: 11 },
      };

      const transactions = getTransactionsForMonth(i, currentYear);
      const total = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        value: total,
        label: getMonthShortName(i),
        frontColor: i === currentMonth ? theme.primary : theme.textTertiary,
        labelTextStyle: { color: theme.textSecondary, fontSize: 11 },
      };
    });
  }, [currentMonth, currentYear, theme]);

  const maxValue = Math.max(...monthlyData.map(d => d.value), 1);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Monthly expenses {currentYear}
      </Text>
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
  title: {
    fontSize: 20,
    fontWeight: '700',
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
});
import { View, Text, StyleSheet } from 'react-native';
import { TransactionCategory } from '../../types/transactions';
import { Transactions } from '../../types/transactions';
import { useMemo } from 'react';
import { useSettings } from '../../context/settingsContext';

interface Props {
    transactions: Transactions[];
}

export default function ExpenseBar({ transactions }: Props) {
    const { theme, categoryColors } = useSettings();
    
    // total expenses
    const total = useMemo(
        () => transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0),
        [transactions]
    );

    // group expenses by category with percentage
    const segments = useMemo(() => {
        const map: Partial<Record<TransactionCategory, number>> = {};
        transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            map[t.category] = (map[t.category] ?? 0) + t.amount;
        });

        return Object.entries(map).map(([cat, amount]) => ({
        category: cat as TransactionCategory,
        percentage: total > 0 ? ((amount ?? 0) / total) * 100 : 0,
        amount: amount ?? 0,
        }));
    }, [transactions, total]);

    if (total === 0) {
        return (
        <View style={[styles.container, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.textSecondary }]}>Expenses</Text>
            <View style={[styles.emptyBar, { backgroundColor: theme.divider }]} />
            <Text style={[styles.empty, { color: theme.textTertiary }]}>No expenses this month</Text>
        </View>
        );
    }
    

    return (
        <View style={[styles.container, { backgroundColor: theme.card }]}>

        <Text style={[styles.title, { color: theme.textSecondary }]}>Expenses breakdown</Text>
        <Text style={[styles.total, { color: theme.text }]}>{total.toFixed(2)}€</Text>

        {/* The bar */}
        <View style={[styles.bar, { backgroundColor: theme.divider }]}>
            {segments.map((seg, index) => (
            <View
                key={seg.category}
                style={[
                styles.segment,
                {
                    flex: seg.percentage,
                    backgroundColor: categoryColors[seg.category],
                    borderTopLeftRadius: index === 0 ? 8 : 0,
                    borderBottomLeftRadius: index === 0 ? 8 : 0,
                    borderTopRightRadius: index === segments.length - 1 ? 8 : 0,
                    borderBottomRightRadius: index === segments.length - 1 ? 8 : 0,
                },
                ]}
            />
            ))}
        </View>

        {/* Legend */}
        <View style={styles.legend}>
            {segments.map((seg) => (
            <View key={seg.category} style={styles.legendRow}>
                <View style={[styles.dot, { backgroundColor: categoryColors[seg.category] }]} />
                <Text style={[styles.legendLabel, { color: theme.text }]}>{seg.category}</Text>
                <Text style={[styles.legendAmount, { color: theme.text }]}>{seg.amount.toFixed(2)}€</Text>
            </View>
            ))}
        </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        padding: 20,
        gap: 12,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
    },
    total: {
        fontSize: 22,
        fontWeight: '700',
    },
    bar: {
        flexDirection: 'row',
        height: 20,
        borderRadius: 8,
        overflow: 'hidden',
    },
    segment: {
        height: '100%',
    },
    emptyBar: {
        height: 20,
        borderRadius: 8,
    },
    empty: {
        fontSize: 13,
        textAlign: 'center',
    },
    legend: {
        gap: 8,
        marginTop: 4,
    },
    legendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    legendLabel: {
        flex: 1,
        fontSize: 13,
        textTransform: 'capitalize',
    },
    legendAmount: {
        fontSize: 13,
        fontWeight: '600',
    },
});
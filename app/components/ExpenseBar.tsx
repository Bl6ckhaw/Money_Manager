import { View, Text, StyleSheet } from 'react-native';
import { CATEGORY_COLORS, TransactionCategory } from '../../types/transactions';
import { Transactions } from '../../types/transactions';
import { useMemo } from 'react';

interface Props {
    transactions: Transactions[];
}

export default function ExpenseBar({ transactions }: Props) {
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
        <View style={styles.container}>
            <Text style={styles.title}>Expenses</Text>
            <View style={styles.emptyBar} />
            <Text style={styles.empty}>No expenses this month</Text>
        </View>
        );
    }

    return (
        <View style={styles.container}>

        <Text style={styles.title}>Expenses breakdown</Text>
        <Text style={styles.total}>{total.toFixed(2)}€</Text>

        {/* The bar */}
        <View style={styles.bar}>
            {segments.map((seg, index) => (
            <View
                key={seg.category}
                style={[
                styles.segment,
                {
                    flex: seg.percentage,
                    backgroundColor: CATEGORY_COLORS[seg.category],
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
                <View style={[styles.dot, { backgroundColor: CATEGORY_COLORS[seg.category] }]} />
                <Text style={styles.legendLabel}>{seg.category}</Text>
                <Text style={styles.legendAmount}>{seg.amount.toFixed(2)}€</Text>
            </View>
            ))}
        </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        gap: 12,
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
    },
    total: {
        fontSize: 22,
        fontWeight: '700',
        color: '#222',
    },
    bar: {
        flexDirection: 'row',
        height: 20,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f1f1f1',
    },
    segment: {
        height: '100%',
    },
    emptyBar: {
        height: 20,
        borderRadius: 8,
        backgroundColor: '#f1f1f1',
    },
    empty: {
        fontSize: 13,
        color: '#aaa',
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
        color: '#555',
        textTransform: 'capitalize',
    },
    legendAmount: {
        fontSize: 13,
        fontWeight: '600',
        color: '#222',
    },
});
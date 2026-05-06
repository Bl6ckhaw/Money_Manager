import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTransactions } from '../../context/transactionsContext';

export default function MonthNavigator() {
    const { selectedMonth, selectedYear, goToPreviousMonth, goToNextMonth } = useTransactions();

    const now = new Date();
    const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
    
    const monthName = new Date(selectedYear, selectedMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <View style={styles.container}>

            <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrow}>
                <Text style={styles.arrowText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.label}>{monthName}</Text>

            <TouchableOpacity onPress={goToNextMonth} style={styles.arrow} disabled={isCurrentMonth}>
                <Text style={[styles.arrowText, isCurrentMonth && styles.arrowDisabled]}>›</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    arrow: {
        padding: 8,
        width: 40,
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 28,
        color: '#6366f1',
        fontWeight: '600',
    },
    arrowDisabled: {
        color: '#ccc',
    },
    label: {
        fontSize: 17,
        fontWeight: '700',
        color: '#222',
        textTransform: 'capitalize',
    },
}); 
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTransactions } from '../../context/transactionsContext';
import { useSettings } from '../../context/settingsContext';

export default function MonthNavigator() {
    const { selectedMonth, selectedYear, goToPreviousMonth, goToNextMonth } = useTransactions();
    const { theme } = useSettings();

    const now = new Date();
    const isCurrentMonth = selectedMonth === now.getMonth() && selectedYear === now.getFullYear();
    
    const monthName = new Date(selectedYear, selectedMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <View style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}>

            <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrow}>
                <Text style={[styles.arrowText, { color: theme.primary }]}>‹</Text>
            </TouchableOpacity>

            <Text style={[styles.label, { color: theme.text }]}>{monthName}</Text>

            <TouchableOpacity onPress={goToNextMonth} style={styles.arrow} disabled={isCurrentMonth}>
                <Text style={[styles.arrowText, { color: isCurrentMonth ? theme.textTertiary : theme.primary }]}>›</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    arrow: {
        padding: 8,
        width: 40,
        alignItems: 'center',
    },
    arrowText: {
        fontSize: 28,
        fontWeight: '600',
    },
    label: {
        fontSize: 17,
        fontWeight: '700',
        textTransform: 'capitalize',
    },
}); 
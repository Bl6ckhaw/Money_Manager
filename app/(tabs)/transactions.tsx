import React, { useMemo } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTransactions } from '../../context/transactionsContext';
import TransactionsItem from '../components/TransactionsItem';
import AddTransactionModal from '../components/AddTransactionsModal';
import MonthNavigator from '../components/MonthNavigator';
import { useSettings } from '../../context/settingsContext';

export default function Transactions() {
    const { transactions, selectedMonth, selectedYear } = useTransactions();
    const [ModalVisible, setIsModalVisible] = useState(false);
    const { theme } = useSettings();

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const now = new Date();
    const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear;

    const { getTransactionsForMonth } = useTransactions();

    const monthlyTransactions = useMemo(
      () => getTransactionsForMonth(selectedMonth, selectedYear),
      [selectedMonth, selectedYear, transactions]
    );

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>

        {/* Header summary */}
        <MonthNavigator />

        {/* List */}
        <FlatList
            data={monthlyTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionsItem transactions={item} isCurrentMonth={isCurrentMonth} />}
            ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.textTertiary }]}>No transactions this month</Text>
            }
        />

        {/* FAB button */}
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: isCurrentMonth ? theme.primary : theme.border },
          ]}
          onPress={() => isCurrentMonth && setIsModalVisible(true)}
        >
            <Text style={[styles.fabText, { color: theme.background }]}>+</Text>
        </TouchableOpacity>

        {/* Modal */}
        <AddTransactionModal
            visible={ModalVisible}
            onClose={() => setIsModalVisible(false)}
        />

        </View>
    );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    lineHeight: 32,
  },
});
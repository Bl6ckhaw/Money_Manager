import React, { useMemo } from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useTransactions } from '../../context/transactionsContext';
import TransactionsItem from '../components/TransactionsItem';
import AddTransactionModal from '../components/AddTransactionsModal';
import MonthNavigator from '../components/MonthNavigator';

export default function Transactions() {
    const { transactions, selectedMonth, selectedYear } = useTransactions();
    const [ModalVisible, setIsModalVisible] = useState(false);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const { getTransactionsForMonth } = useTransactions();

    const monthlyTransactions = useMemo(
      () => getTransactionsForMonth(selectedMonth, selectedYear),
      [selectedMonth, selectedYear, transactions]
    );

    return (
        <View style={styles.container}>

        {/* Header summary */}
        <MonthNavigator />

        {/* List */}
        <FlatList
            data={monthlyTransactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionsItem transactions={item} />}
            ListEmptyComponent={
            <Text style={styles.empty}>No transactions this month</Text>
            }
        />

        {/* FAB button */}
        <TouchableOpacity style={styles.fab} onPress={() => setIsModalVisible(true)}>
            <Text style={styles.fabText}>+</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  headerCount: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    color: '#aaa',
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6366f1',
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
    color: '#fff',
    lineHeight: 32,
  },
});
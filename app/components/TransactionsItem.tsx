import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Transactions } from '../../types/transactions';
import { useTransactions } from '../../context/transactionsContext';

interface Props {
    transactions: Transactions;
}

export default function TransactionsItem({ transactions }: Props) {
    const { deleteTransaction } = useTransactions();
    const isIncome = transactions.type === 'income';

    return (
        <TouchableOpacity style={styles.container} onPress={() => Alert.alert('Do you want to delete this transaction?', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(transactions.id) },
        ])}>        
          <View style={styles.left}>
            <Text style={styles.label}>{transactions.label}</Text>
            <Text style={styles.category}>{transactions.category}</Text>
          </View>
          <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
            {isIncome ? '+' : '-'} {transactions.amount} €
          </Text>
        </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  left: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  category: {
    fontSize: 12,
    color: '#888',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  income: {
    color: '#22c55e',
  },
  expense: {
    color: '#ef4444', 
  },
});
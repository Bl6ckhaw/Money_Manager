import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Transactions } from '../../types/transactions';
import TransactionDetailModal from './TransactionDetailModal';
import { useSettings } from '../../context/settingsContext';

interface Props {
    transactions: Transactions;
    isCurrentMonth: boolean;
}

export default function TransactionsItem({ transactions, isCurrentMonth }: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const { theme } = useSettings();
    const isIncome = transactions.type === 'income';

    return (
      <>
        <TouchableOpacity
          style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => isCurrentMonth && setModalVisible(true)}
        >
          <View style={styles.left}>
            <Text style={[styles.label, { color: theme.text }]}>{transactions.label}</Text>
            <Text style={[styles.category, { color: theme.textSecondary }]}>{transactions.category}</Text>
          </View>
          <Text style={[styles.amount, { color: isIncome ? theme.income : theme.expense }]}>
            {isIncome ? '+' : '-'}{transactions.amount.toFixed(2)}€
          </Text>
        </TouchableOpacity>

        <TransactionDetailModal
          visible={modalVisible}
          transaction={transactions}
          onClose={() => setModalVisible(false)}
        />
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  left: {
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
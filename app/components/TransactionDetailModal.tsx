import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { Transactions, TransactionCategory, TransactionType, CATEGORY_COLORS } from '../../types/transactions';
import { useTransactions } from '../../context/transactionsContext';
import { TextInput } from 'react-native';
import { useSettings } from '../../context/settingsContext';

interface Props {
  transaction: Transactions | null;
  visible: boolean;
  onClose: () => void;
}

export default function TransactionDetailModal({ transaction, visible, onClose }: Props) {
  const { deleteTransaction, updateTransaction, addException, selectedMonth, selectedYear } = useTransactions();
  const { theme } = useSettings();

  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [recurring, setRecurring] = useState(false);

  // sync local state when transaction changes
  React.useEffect(() => {
    if (transaction) {
      setLabel(transaction.label);
      setAmount(transaction.amount.toString());
      setRecurring(transaction.recurring);
      setIsEditing(false);
    }
  }, [transaction]);

  if (!transaction) return null;

  const isInjected = transaction.id.includes('_');
  const originalId = isInjected ? transaction.id.split('_')[0] : transaction.id;
  const isIncome = transaction.type === 'income';

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  const handleSave = () => {
    updateTransaction({
      ...transaction,
      id: originalId,
      label: label.trim(),
      amount: parseFloat(amount),
      recurring,
    });
    handleClose();
  };

  const handleDelete = () => {
    if (isInjected) {
      // recurring injected — disable for this month only
      addException({
        transactionId: originalId,
        month: selectedMonth,
        year: selectedYear,
      });
    } else {
      deleteTransaction(transaction.id);
    }
    handleClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={handleClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.sheet, { backgroundColor: theme.card }]}>

          {/* Color accent top bar */}
          <View style={[styles.accent, { backgroundColor: CATEGORY_COLORS[transaction.category as TransactionCategory] }]} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.category, { color: theme.textSecondary }]}>{transaction.category}</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={[styles.closeBtn, { color: theme.textTertiary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            // Edit mode
            <View style={styles.editContainer}>
              <TextInput
                style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
                value={label}
                onChangeText={setLabel}
                placeholderTextColor={theme.textTertiary}
                placeholder="Label"
              />
              <TextInput
                style={[styles.input, { backgroundColor: theme.input, borderColor: theme.border, color: theme.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                placeholderTextColor={theme.textTertiary}
                placeholder="Amount"
              />
              <View style={[styles.recurringRow, { backgroundColor: theme.input, borderColor: theme.border }]}>
                <Text style={[styles.recurringLabel, { color: theme.text }]}>Repeat monthly</Text>
                <Switch
                  value={recurring}
                  onValueChange={setRecurring}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={theme.card}
                />
              </View>
            </View>
          ) : (
            // View mode
            <View style={styles.viewContainer}>
              <Text style={[styles.label, { color: theme.text }]}>{transaction.label}</Text>
              <Text style={[styles.amount, { color: isIncome ? theme.income : theme.expense }]}>
                {isIncome ? '+' : '-'}{transaction.amount.toFixed(2)}€
              </Text>
              <Text style={[styles.date, { color: theme.textTertiary }]}>{transaction.date}</Text>
              {transaction.recurring && (
                <View style={[styles.recurringBadge, { backgroundColor: theme.primaryLight }]}>
                  <Text style={[styles.recurringBadgeText, { color: theme.primary }]}>🔁 Recurring</Text>
                </View>
              )}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            {isEditing ? (
              <>
                <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={() => setIsEditing(false)}>
                  <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: theme.primary }]} onPress={handleSave}>
                  <Text style={[styles.saveText, { color: theme.card }]}>Save</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={[styles.deleteBtn, { borderColor: theme.expense }]} onPress={handleDelete}>
                  <Text style={[styles.deleteText, { color: theme.expense }]}>
                    {isInjected ? 'Delete this month' : 'Delete'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.primary }]} onPress={() => setIsEditing(true)}>
                  <Text style={[styles.editText, { color: theme.card }]}>Edit</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    borderRadius: 20,
    width: '85%',
    overflow: 'hidden',
  },
  accent: {
    height: 6,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 8,
  },
  category: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  closeBtn: {
    fontSize: 16,
    padding: 4,
  },
  viewContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 8,
  },
  label: {
    fontSize: 22,
    fontWeight: '700',
  },
  amount: {
    fontSize: 28,
    fontWeight: '800',
  },
  date: {
    fontSize: 13,
  },
  recurringBadge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  recurringBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  recurringRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  recurringLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
  },
  deleteBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  deleteText: {
    fontWeight: '600',
    fontSize: 14,
  },
  editBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  editText: {
    fontWeight: '700',
    fontSize: 14,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveText: {
    fontWeight: '700',
  },
});
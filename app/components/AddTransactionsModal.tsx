import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import { Transactions, TransactionCategory, TransactionType } from '../../types/transactions';
import { useTransactions } from '../../context/transactionsContext';
import { useSettings } from '../../context/settingsContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CATEGORIES: TransactionCategory[] = [
    'Food',
    'Transport',
    'Entertainment',
    'Salary',
    'Investment',
    'Health',
    'Other'
];

export default function AddTransactionModal({ visible, onClose }: Props) {
  const { addTransactions } = useTransactions();
  const { theme } = useSettings();

  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('Other');
  const [recurring, setRecurring] = useState(false);

  const handleSubmit = () => {
    if (!label.trim() || !amount) return;

    const newTransaction: Transactions = {
      id: Date.now().toString(),
      label: label.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0],
      recurring,
    };

    addTransactions(newTransaction);
    handleClose();
  };

  const handleClose = () => {
    setLabel('');
    setAmount('');
    setType('expense');
    setCategory('Other');
    setRecurring(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.overlay, { backgroundColor: theme.overlay }]}
      >
        <View style={[styles.sheet, { backgroundColor: theme.card }]}>

          {/* Title */}
          <Text style={[styles.title, { color: theme.text }]}>New Transaction</Text>

          {/* Type toggle */}
          <View style={[styles.toggle, { backgroundColor: theme.divider }]}>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                type === 'expense' && styles.toggleActive,
                type === 'expense' && { backgroundColor: theme.card },
              ]}
              onPress={() => setType('expense')}
            >
              <Text style={[styles.toggleText, { color: type === 'expense' ? theme.text : theme.textSecondary }]}>
                Expense
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleBtn,
                type === 'income' && styles.toggleActive,
                type === 'income' && { backgroundColor: theme.card },
              ]}
              onPress={() => setType('income')}
            >
              <Text style={[styles.toggleText, { color: type === 'income' ? theme.text : theme.textSecondary }]}>
                Income
              </Text>
            </TouchableOpacity>
          </View>

          {/* Label input */}
          <TextInput
            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.input, color: theme.text }]}
            placeholder="Label (ex: Groceries)"
            placeholderTextColor={theme.textTertiary}
            value={label}
            onChangeText={setLabel}
          />

          {/* Amount input */}
          <TextInput
            style={[styles.input, { borderColor: theme.border, backgroundColor: theme.input, color: theme.text }]}
            placeholder="Amount (ex: 42.50)"
            placeholderTextColor={theme.textTertiary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />

          {/* Category picker */}
          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>Category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catBtn,
                  { borderColor: theme.border, backgroundColor: theme.input },
                  category === cat && { backgroundColor: theme.primary, borderColor: theme.primary },
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.catText, { color: category === cat ? theme.card : theme.textSecondary, fontWeight: category === cat ? '600' : '400' }]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Recurring toggle */}
          <View style={[styles.recurringRow, { backgroundColor: theme.input, borderColor: theme.border }]}>
            <View style={styles.recurringText}>
              <Text style={[styles.recurringTitle, { color: theme.text }]}>Repeat monthly</Text>
              <Text style={[styles.recurringSubtitle, { color: theme.textSecondary }]}>
                Automatically added every month
              </Text>
            </View>
            <Switch
              value={recurring}
              onValueChange={setRecurring}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.card}
            />
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.border }]} onPress={handleClose}>
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: theme.primary }]} onPress={handleSubmit}>
              <Text style={[styles.confirmText, { color: theme.card }]}>Add</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  catText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontWeight: '700',
  },
  recurringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
  },
  recurringText: {
    gap: 2,
  },
  recurringTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  recurringSubtitle: {
    fontSize: 12,
  },
});
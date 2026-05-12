import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useSettings } from '../../context/settingsContext';
import { useState } from 'react';

interface MonthYear {
  month: number;
  year: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (start: MonthYear, end: MonthYear) => void;
  initialStart: MonthYear;
  initialEnd: MonthYear;
}

function getMonthName(month: number, year: number): string {
  return new Date(year, month, 1).toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });
}

function MonthPicker({
  label,
  value,
  onChange,
  max,
}: {
  label: string;
  value: MonthYear;
  onChange: (v: MonthYear) => void;
  max: MonthYear;
}) {
  const { theme } = useSettings();

  const isAtMax =
    value.year === max.year && value.month === max.month;

  const goNext = () => {
    if (isAtMax) return;
    if (value.month === 11) {
      onChange({ month: 0, year: value.year + 1 });
    } else {
      onChange({ month: value.month + 1, year: value.year });
    }
  };

  const goPrev = () => {
    if (value.month === 0) {
      onChange({ month: 11, year: value.year - 1 });
    } else {
      onChange({ month: value.month - 1, year: value.year });
    }
  };

  return (
    <View style={styles.pickerContainer}>
      <Text style={[styles.pickerLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <View style={[styles.pickerRow, { backgroundColor: theme.input, borderColor: theme.border }]}>
        <TouchableOpacity onPress={goPrev} style={styles.pickerArrow}>
          <Text style={[styles.arrowText, { color: theme.primary }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.pickerValue, { color: theme.text }]}>
          {getMonthName(value.month, value.year)}
        </Text>
        <TouchableOpacity
          onPress={goNext}
          style={styles.pickerArrow}
          disabled={isAtMax}
        >
          <Text style={[styles.arrowText, { color: isAtMax ? theme.border : theme.primary }]}>
            ›
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function CustomRangeModal({
  visible,
  onClose,
  onConfirm,
  initialStart,
  initialEnd,
}: Props) {
  const { theme } = useSettings();
  const now = new Date();
  const max = { month: now.getMonth(), year: now.getFullYear() };

  const [start, setStart] = useState(initialStart);
  const [end, setEnd] = useState(initialEnd);

  const handleConfirm = () => {
    // make sure start is before end
    const startTime = start.year * 12 + start.month;
    const endTime = end.year * 12 + end.month;

    if (startTime > endTime) {
      onConfirm(end, start); // swap if needed
    } else {
      onConfirm(start, end);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: theme.card }]}>

          <Text style={[styles.title, { color: theme.text }]}>
            Custom range
          </Text>

          <MonthPicker
            label="From"
            value={start}
            onChange={setStart}
            max={max}
          />

          <MonthPicker
            label="To"
            value={end}
            onChange={setEnd}
            max={max}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.border }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
              onPress={handleConfirm}
            >
              <Text style={[styles.confirmText, { color: theme.background }]}>
                Apply
              </Text>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  pickerContainer: {
    gap: 8,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  pickerArrow: {
    padding: 14,
    width: 48,
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 24,
    fontWeight: '600',
  },
  pickerValue: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
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
  confirmBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmText: {
    fontWeight: '700',
  },
});
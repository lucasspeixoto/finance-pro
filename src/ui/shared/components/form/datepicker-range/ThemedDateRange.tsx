import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../../core/theme/theme.hooks';
import { typography } from '../../../../../core/theme/theme.typography';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface ThemedDateRangeProps {
  label?: string;
  value: DateRange;
  onChange: (range: DateRange) => void;
  error?: string;
}

const ThemedDateRange: React.FC<ThemedDateRangeProps> = ({ label, value, onChange, error }) => {
  const { colors } = useTheme();

  const [activePicker, setActivePicker] = useState<'start' | 'end' | null>(null);

  const onDateChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    setActivePicker(null);

    if (!selectedDate) return;

    if (activePicker === 'start') {
      onChange({ ...value, start: selectedDate });
    } else {
      onChange({ ...value, end: selectedDate });
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString('pt-BR');

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>}

      <View style={styles.row}>
        {/* Input Início */}
        <TouchableOpacity
          style={[
            styles.input,
            { backgroundColor: colors.surfaceVariant, borderColor: error ? colors.danger : colors.border },
          ]}
          onPress={() => setActivePicker('start')}
        >
          <Text style={[styles.inputSubtitle, { color: colors.textTertiary }]}>Início</Text>
          <Text style={[styles.inputText, { color: colors.text }]}>{formatDate(value.start)}</Text>
        </TouchableOpacity>

        <View style={{ width: 16 }} />

        {/* Input Fim */}
        <TouchableOpacity
          style={[
            styles.input,
            { backgroundColor: colors.surfaceVariant, borderColor: error ? colors.danger : colors.border },
          ]}
          onPress={() => setActivePicker('end')}
        >
          <Text style={[styles.inputSubtitle, { color: colors.textTertiary }]}>Fim</Text>
          <Text style={[styles.inputText, { color: colors.text }]}>{formatDate(value.end)}</Text>
        </TouchableOpacity>
      </View>

      {activePicker && (
        <DateTimePicker
          value={activePicker === 'start' ? value.start : value.end}
          mode="date"
          minimumDate={activePicker === 'end' ? value.start : undefined}
          onChange={onDateChange}
        />
      )}

      {error && <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    ...typography.smallMedium,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    flex: 1,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  inputSubtitle: {
    ...typography.caption,
    marginBottom: 2,
  },
  inputText: {
    ...typography.body,
  },
  errorText: {
    ...typography.small,
    marginTop: 8,
    marginLeft: 4,
  },
});

export default ThemedDateRange;

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../../core/theme/theme.hooks';
import { typography } from '../../../../../core/theme/theme.typography';

export interface ThemedDatePickerProps {
  label?: string;
  value: Date;
  onChange: (date: Date) => void;
  error?: string;
  placeholder?: string;
  mode?: 'date' | 'time' | 'datetime';
}

const ThemedDatePicker: React.FC<ThemedDatePickerProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  mode = 'date',
}) => {
  const { colors } = useTheme();
  const [show, setShow] = useState(false);

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // No Android, precisamos fechar o seletor manualmente
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR'); // Adapte para seu locale
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShow(true)}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        <Text style={[styles.inputText, { color: value ? colors.text : colors.textTertiary }]}>
          {value ? formatDate(value) : placeholder}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
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
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
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

export default ThemedDatePicker;

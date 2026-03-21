import React, { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../../core/theme/theme.hooks';
import { typography } from '../../../../../core/theme/theme.typography';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface ThemedDropdownProps {
  label?: string;
  value?: string | number | null;
  onSelect: (value: string | number) => void;
  options: DropdownOption[];
  placeholder?: string;
  error?: string;
  // Opcional: ícone para indicar dropdown (ex: seta para baixo)
  rightIcon?: React.ReactNode;
}

const ThemedDropdown: React.FC<ThemedDropdownProps> = ({
  label,
  value,
  onSelect,
  options,
  placeholder = 'Selecione uma opção',
  error,
  rightIcon,
}) => {
  const { colors } = useTheme();

  const [visible, setVisible] = useState(false);

  // Encontra o label da opção selecionada baseada no valor atual
  const selectedOption = options?.find((opt) => opt.value === value);

  const handleSelect = (item: DropdownOption) => {
    onSelect(item.value);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text>}

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: error ? colors.danger : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.inputText,
            { color: selectedOption ? colors.text : colors.textTertiary }
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>

        {/* Renderiza o ícone passado ou um caractere simples de seta se não houver ícone */}
        {rightIcon || <Text style={{ color: colors.textSecondary, marginLeft: 8 }}>▼</Text>}
      </TouchableOpacity>

      {error ? <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text> : null}

      {/* Modal de Seleção */}
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{label || placeholder}</Text>

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    { borderBottomColor: colors.border },
                    item.value === value && { backgroundColor: colors.surfaceVariant },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={[styles.optionText, { color: colors.text }]}>{item.label}</Text>
                  {item.value === value && <Text style={{ color: colors.primary }}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.smallMedium,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputText: {
    ...typography.body,
    flex: 1,
  },
  errorText: {
    ...typography.small,
    marginTop: 8,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    maxHeight: '60%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    ...typography.title,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
  },
  optionText: {
    ...typography.body,
  },
});

export default ThemedDropdown;

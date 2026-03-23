import React from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { typography } from '@/src/core/theme/theme.typography';
import { ThemeColors } from '@/src/core/theme/theme.colors';

interface FilterModalsProps {
  colors: ThemeColors;
  showCategoryPicker: boolean;
  onCloseCategoryPicker: () => void;
  categories: any[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  showAccountPicker: boolean;
  onCloseAccountPicker: () => void;
  accounts: any[];
  selectedAccountId: string | null;
  onSelectAccount: (id: string | null) => void;
}

export const FilterModals: React.FC<FilterModalsProps> = ({
  colors,
  showCategoryPicker,
  onCloseCategoryPicker,
  categories,
  selectedCategoryId,
  onSelectCategory,
  showAccountPicker,
  onCloseAccountPicker,
  accounts,
  selectedAccountId,
  onSelectAccount,
}) => {
  return (
    <>
      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Selecionar Categoria</Text>
              <TouchableOpacity onPress={onCloseCategoryPicker}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categories}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedCategoryId === item.id && { backgroundColor: colors.surfaceContainerHigh }
                  ]}
                  onPress={() => {
                    onSelectCategory(selectedCategoryId === item.id ? null : item.id);
                    onCloseCategoryPicker();
                  }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>{item.name}</Text>
                  {selectedCategoryId === item.id && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Account Picker Modal */}
      <Modal visible={showAccountPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Selecionar Conta</Text>
              <TouchableOpacity onPress={onCloseAccountPicker}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={accounts}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedAccountId === item.id && { backgroundColor: colors.surfaceContainerHigh }
                  ]}
                  onPress={() => {
                    onSelectAccount(selectedAccountId === item.id ? null : item.id);
                    onCloseAccountPicker();
                  }}
                >
                  <Text style={[styles.modalItemText, { color: colors.text }]}>{item.name}</Text>
                  {selectedAccountId === item.id && (
                    <MaterialIcons name="check" size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    paddingTop: 16,
    paddingHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    ...typography.subtitle,
    fontWeight: '700',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemText: {
    ...typography.body,
  },
});

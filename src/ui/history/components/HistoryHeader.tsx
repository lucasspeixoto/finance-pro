import { ThemeColors } from '@/src/core/theme/theme.colors';
import { typography } from '@/src/core/theme/theme.typography';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface HistoryHeaderProps {
  colors: ThemeColors;
  isDark: boolean;
  selectedDate: Date;
  onShowDatePicker: () => void;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  selectedCategoryId: string | null;
  selectedAccountId: string | null;
  selectedCategoryName?: string;
  selectedAccountName?: string;
  onClearFilters: () => void;
  onShowCategoryPicker: () => void;
  onShowAccountPicker: () => void;
}

export const HistoryHeader: React.FC<HistoryHeaderProps> = ({
  colors,
  isDark,
  selectedDate,
  onShowDatePicker,
  searchQuery,
  onSearchChange,
  selectedCategoryId,
  selectedAccountId,
  selectedCategoryName,
  selectedAccountName,
  onClearFilters,
  onShowCategoryPicker,
  onShowAccountPicker,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>Histórico</Text>
      </View>

      <TouchableOpacity
        style={[styles.monthSelector, { backgroundColor: colors.surfaceContainerLow }]}
        onPress={onShowDatePicker}
      >
        <MaterialIcons name="calendar-today" size={14} color={colors.primary} />
        <Text style={[styles.monthText, { color: colors.text }]}>
          {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
        </Text>
        <MaterialIcons name="expand-more" size={18} color={colors.textTertiary} />
      </TouchableOpacity>

      <View style={[styles.searchContainer, { backgroundColor: colors.surfaceContainerHigh }]}>
        <MaterialIcons name="search" size={20} color={colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Buscar transações..."
          placeholderTextColor={isDark ? colors.textTertiary : '#999'}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            !selectedCategoryId && !selectedAccountId
              ? { backgroundColor: colors.primary }
              : { backgroundColor: colors.surfaceContainer },
          ]}
          onPress={onClearFilters}
        >
          <MaterialIcons
            name="tune"
            size={16}
            color={!selectedCategoryId && !selectedAccountId ? '#FFF' : colors.text}
          />
          <Text
            style={[styles.filterText, { color: !selectedCategoryId && !selectedAccountId ? '#FFF' : colors.text }]}
          >
            Todos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategoryId ? { backgroundColor: colors.primary } : { backgroundColor: colors.surfaceContainer },
          ]}
          onPress={onShowCategoryPicker}
        >
          <Text style={[styles.filterText, { color: selectedCategoryId ? '#FFF' : colors.text }]}>
            {selectedCategoryName || 'Categorias'}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={16} color={selectedCategoryId ? '#FFF' : colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedAccountId ? { backgroundColor: colors.primary } : { backgroundColor: colors.surfaceContainer },
          ]}
          onPress={onShowAccountPicker}
        >
          <Text style={[styles.filterText, { color: selectedAccountId ? '#FFF' : colors.text }]}>
            {selectedAccountName || 'Contas'}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={16} color={selectedAccountId ? '#FFF' : colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 20,
    marginBottom: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.largeTitle,
    fontWeight: '800',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    alignSelf: 'flex-start',
  },
  monthText: {
    ...typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    ...typography.body,
  },
  filtersContainer: {
    paddingBottom: 8,
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    height: 36,
  },
  filterText: {
    ...typography.smallMedium,
  },
});

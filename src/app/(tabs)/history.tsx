import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import type { MaterialIconName } from '@/src/domain/models/icon/material';
import { useDashboardStore } from '@/src/ui/dashboard/stores/dashboard-store';
import { SwipeableTransactionRow } from '@/src/ui/history/components/SwipeableTransactionRow';
import { useHistoryStore } from '@/src/ui/history/stores/history-store';
import { formatCurrency } from '@/src/utils/currency';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { colors, isDark } = useTheme();
  const {
    transactions,
    filteredTransactions,
    isLoading,
    error,
    fetchTransactions,
    setSearchQuery,
    searchQuery,
    deleteTransaction,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedAccountId,
    setSelectedAccountId,
    selectedDate,
    setSelectedDate
  } = useHistoryStore();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showAccountPicker, setShowAccountPicker] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  const { accounts } = useDashboardStore();
  // We can fetch categories separately or just extract from transactions if needed, 
  // but let's assume we have a way to get categories. 
  // For now, I'll use the ones that appear in transactions for the filters.

  const categories = useMemo(() => {
    const uniqueCats = new Map();
    transactions.forEach(t => {
      if (t.categories) {
        uniqueCats.set(t.categories.id, t.categories);
      }
    });
    return Array.from(uniqueCats.values());
  }, [transactions]);

  const accountsFilterList = useMemo(() => {
    const uniqueAccs = new Map();
    transactions.forEach(t => {
      if (t.accounts) {
        uniqueAccs.set(t.accounts.id, t.accounts);
      }
    });
    return Array.from(uniqueAccs.values());
  }, [transactions]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 400);

    return () => clearTimeout(handler);
  }, [localSearchQuery, setSearchQuery]);

  const groupedTransactions = useMemo(() => {
    const groups: { [key: string]: typeof filteredTransactions } = {};
    const now = new Date();
    const todayStr = now.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    filteredTransactions.forEach(tx => {
      const date = new Date(tx.date);
      const dateStr = date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

      let title = dateStr;
      if (dateStr === todayStr) title = 'Hoje';
      else if (dateStr === yesterdayStr) title = 'Ontem';
      else title = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', timeZone: 'UTC' });

      if (!groups[title]) groups[title] = [];
      groups[title].push(tx);
    });

    return Object.entries(groups).map(([title, data]) => ({ title, data }));
  }, [filteredTransactions]);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const selectedAccount = accountsFilterList.find(a => a.id === selectedAccountId);

  if (isLoading && filteredTransactions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.headerContainer}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>History</Text>
        </View>

        <TouchableOpacity
          style={[styles.monthSelector, { backgroundColor: colors.surfaceContainerLow }]}
          onPress={() => setShowDatePicker(true)}
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
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
          />
        </View>

        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              !selectedCategoryId && !selectedAccountId ? { backgroundColor: colors.primary } : { backgroundColor: colors.surfaceContainer }
            ]}
            onPress={() => {
              setSelectedCategoryId(null);
              setSelectedAccountId(null);
            }}
          >
            <MaterialIcons
              name="tune"
              size={16}
              color={!selectedCategoryId && !selectedAccountId ? '#FFF' : colors.text}
            />
            <Text style={[
              styles.filterText,
              { color: !selectedCategoryId && !selectedAccountId ? '#FFF' : colors.text }
            ]}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategoryId ? { backgroundColor: colors.primary } : { backgroundColor: colors.surfaceContainer }
            ]}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={[
              styles.filterText,
              { color: selectedCategoryId ? '#FFF' : colors.text }
            ]}>{selectedCategory ? selectedCategory.name : 'Categorias'}</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={16}
              color={selectedCategoryId ? '#FFF' : colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedAccountId ? { backgroundColor: colors.primary } : { backgroundColor: colors.surfaceContainer }
            ]}
            onPress={() => setShowAccountPicker(true)}
          >
            <Text style={[
              styles.filterText,
              { color: selectedAccountId ? '#FFF' : colors.text }
            ]}>{selectedAccount ? selectedAccount.name : 'Contas'}</Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={16}
              color={selectedAccountId ? '#FFF' : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={groupedTransactions}
        keyExtractor={(item) => item.title}
        renderItem={({ item: group }) => (
          <View style={styles.groupContainer}>
            <View style={styles.groupHeader}>
              <Text style={[styles.groupTitle, { color: colors.text }]}>{group.title}</Text>
              <Text style={[styles.groupTotal, { color: colors.textTertiary }]}>
                {formatCurrency(group.data.reduce((acc, tx) => acc + (tx.type === 'expense' ? -tx.amount : tx.amount), 0))}
              </Text>
            </View>
            <View style={styles.transactionsList}>
              {group.data.map((tx) => (
                <SwipeableTransactionRow
                  key={tx.id}
                  icon={(tx.categories?.icon || 'receipt') as MaterialIconName}
                  title={tx.description || tx.categories?.name || 'Transação'}
                  subtitle={`${tx.categories?.name || 'Sem categoria'}`}
                  amount={`${tx.type === 'income' ? '+' : '-'} ${formatCurrency(tx.amount)}`}
                  amountColor={tx.type === 'income' ? colors.success : colors.danger}
                  iconColor={tx.categories?.color || (tx.type === 'income' ? colors.success : colors.primary)}
                  onDelete={() => deleteTransaction(tx.id)}
                  onEdit={() => console.log('Edit', tx.id)}
                />
              ))}
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
              Nenhuma transação encontrada.
            </Text>
          </View>
        }
      />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setShowDatePicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Selecionar Categoria</Text>
              <TouchableOpacity onPress={() => setShowCategoryPicker(false)}>
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
                    setSelectedCategoryId(selectedCategoryId === item.id ? null : item.id);
                    setShowCategoryPicker(false);
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
              <TouchableOpacity onPress={() => setShowAccountPicker(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={accountsFilterList}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    selectedAccountId === item.id && { backgroundColor: colors.surfaceContainerHigh }
                  ]}
                  onPress={() => {
                    setSelectedAccountId(selectedAccountId === item.id ? null : item.id);
                    setShowAccountPicker(false);
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 100,
  },
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
  groupContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  groupTitle: {
    ...typography.subtitle,
    fontWeight: 'bold',
  },
  groupTotal: {
    ...typography.small,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
  },
});

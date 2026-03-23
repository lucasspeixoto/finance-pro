import React from 'react';
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { useHistory } from '@/src/ui/history/view-models/useHistory';
import { HistoryHeader } from '@/src/ui/history/components/HistoryHeader';
import { FilterModals } from '@/src/ui/history/components/FilterModals';
import { TransactionListGroup } from '@/src/ui/history/components/TransactionListGroup';
import { ConfirmationDialog } from '@/src/shared/components/dialogs/ConfirmationDialog';

export default function HistoryScreen() {
  const {
    colors,
    isDark,
    filteredTransactions,
    isLoading,
    localSearchQuery,
    setLocalSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedAccountId,
    setSelectedAccountId,
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    showCategoryPicker,
    setShowCategoryPicker,
    showAccountPicker,
    setShowAccountPicker,
    categories,
    accountsFilterList,
    groupedTransactions,
    selectedCategory,
    selectedAccount,
    handleDeletePress,
    showConfirmDelete,
    confirmDelete,
    cancelDelete
  } = useHistory();

  if (isLoading && filteredTransactions.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <HistoryHeader
        colors={colors}
        isDark={isDark}
        selectedDate={selectedDate}
        onShowDatePicker={() => setShowDatePicker(true)}
        searchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        selectedCategoryId={selectedCategoryId}
        selectedAccountId={selectedAccountId}
        selectedCategoryName={selectedCategory?.name}
        selectedAccountName={selectedAccount?.name}
        onClearFilters={() => {
          setSelectedCategoryId(null);
          setSelectedAccountId(null);
        }}
        onShowCategoryPicker={() => setShowCategoryPicker(true)}
        onShowAccountPicker={() => setShowAccountPicker(true)}
      />

      <FlatList
        data={groupedTransactions}
        keyExtractor={(item) => item.title}
        renderItem={({ item: group }) => (
          <TransactionListGroup
            title={group.title}
            data={group.data}
            colors={colors}
            onDelete={handleDeletePress}
            onEdit={(id) => console.log('Edit', id)}
          />
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

      <FilterModals
        colors={colors}
        showCategoryPicker={showCategoryPicker}
        onCloseCategoryPicker={() => setShowCategoryPicker(false)}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={setSelectedCategoryId}
        showAccountPicker={showAccountPicker}
        onCloseAccountPicker={() => setShowAccountPicker(false)}
        accounts={accountsFilterList}
        selectedAccountId={selectedAccountId}
        onSelectAccount={setSelectedAccountId}
      />

      <ConfirmationDialog
        visible={showConfirmDelete}
        title="Excluir Transação"
        message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        colors={colors}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
      />
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import type { MaterialIconName } from '@/src/domain/models/icon/material';
import { ConfirmationDialog } from '@/src/shared/components/dialogs/ConfirmationDialog';
import { SwipeableAdminRow } from '@/src/shared/components/SwipeableAdminRow';
import { useAccounts } from '@/src/ui/accounts/view-models/useAccounts';
import { useCategories } from '@/src/ui/categories/view-models/useCategories';
import { formatCurrency } from '@/src/utils/currency';

export default function AdminScreen() {
  const { colors } = useTheme();
  const {
    accounts,
    deleteAccount,
    handleEditAccount,
    handleAddAccount
  } = useAccounts();
  const {
    categories,
    deleteCategory,
    handleEditCategory,
    handleAddCategory
  } = useCategories();

  const [confirmDelete, setConfirmDelete] = useState<{ id: string, type: 'account' | 'category' } | null>(null);

  const handleDeletePress = (id: string, type: 'account' | 'category') => {
    setConfirmDelete({ id, type });
  };

  const onConfirmDelete = async () => {
    if (!confirmDelete) return;

    if (confirmDelete.type === 'account') {
      await deleteAccount(confirmDelete.id);
    } else {
      await deleteCategory(confirmDelete.id);
    }
    setConfirmDelete(null);
  };

  const accountTypeMap: Record<string, string> = {
    checking: 'Conta Corrente',
    savings: 'Poupança',
    cash: 'Dinheiro',
    investment: 'Investimentos',
    credit_card: 'Cartão de Crédito',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Administração</Text>

        {/* Accounts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Suas Contas</Text>
            <View style={[styles.divider, { backgroundColor: colors.surfaceContainerHighest }]} />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: `${colors.primary}20` }]}
              onPress={handleAddAccount}
            >
              <MaterialIcons name="add" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {accounts.map((account) => (
              <SwipeableAdminRow
                key={account.id}
                icon={(account.icon || 'account-balance') as MaterialIconName}
                iconBackgroundColor={account.color || colors.primary}
                iconTintColor="#FFFFFF"
                title={account.name}
                subtitle={accountTypeMap[account.type] || account.type}
                topRightText={formatCurrency(account.balance)}
                bottomRightText={account.is_active ? 'Ativa' : 'Inativa'}
                bottomRightColor={colors.primary}
                bottomRightBgColor={`${colors.primary}20`}
                onDelete={() => handleDeletePress(account.id, 'account')}
                onEdit={() => handleEditAccount(account.id)}
              />
            ))}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Suas Categorias</Text>
            <View style={[styles.divider, { backgroundColor: colors.surfaceContainerHighest }]} />
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: `${colors.primary}20` }]}
              onPress={handleAddCategory}
            >
              <MaterialIcons name="add" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.list}>
            {categories.map((category) => (
              <SwipeableAdminRow
                key={category.id}
                icon={(category.icon || 'category') as MaterialIconName}
                iconColor={category.color || colors.primary}
                title={category.name}
                subtitle={category.type === 'income' ? 'Receita' : 'Despesa'}
                bottomRightText={category.is_default ? 'Padrão' : undefined}
                onDelete={() => handleDeletePress(category.id, 'category')}
                onEdit={() => handleEditCategory(category.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <ConfirmationDialog
        visible={!!confirmDelete}
        title={`Excluir ${confirmDelete?.type === 'account' ? 'Conta' : 'Categoria'}`}
        message={`Tem certeza que deseja excluir esta ${confirmDelete?.type === 'account' ? 'conta' : 'categoria'}? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        colors={colors}
        onClose={() => setConfirmDelete(null)}
        onConfirm={onConfirmDelete}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 100,
  },
  headerTitle: {
    ...typography.title,
    fontWeight: '800',
    marginBottom: 40,
  },
  section: {
    marginBottom: 48,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  sectionTitle: {
    ...typography.subtitle,
    fontWeight: 'bold',
  },
  divider: {
    flex: 1,
    height: 1,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    gap: 16,
  },
});

/* eslint-disable max-len */
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
  const { colors, isDark } = useTheme();
  const { accounts, deleteAccount, transferBalance, handleEditAccount, handleAddAccount } = useAccounts();
  const { categories, deleteCategory, handleEditCategory, handleAddCategory } = useCategories();

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; type: 'account' | 'category' } | null>(null);
  const [transferModalVisible, setTransferModalVisible] = useState(false);
  const [transferFromAccountId, setTransferFromAccountId] = useState('');
  const [transferToAccountId, setTransferToAccountId] = useState('');
  const [transferAmount, setTransferAmount] = useState('');

  const handleDeletePress = (id: string, type: 'account' | 'category') => {
    setConfirmDelete({ id, type });
  };

  const handleOpenTransferModal = (accountId: string) => {
    const destinationAccount = accounts.find((account) => account.id !== accountId);
    setTransferFromAccountId(accountId);
    setTransferToAccountId(destinationAccount?.id || '');
    setTransferAmount('');
    setTransferModalVisible(true);
  };

  const handleCloseTransferModal = () => {
    setTransferModalVisible(false);
    setTransferFromAccountId('');
    setTransferToAccountId('');
    setTransferAmount('');
  };

  const handleConfirmTransfer = async () => {
    const transferred = await transferBalance(transferFromAccountId, transferToAccountId, transferAmount);
    if (transferred) {
      handleCloseTransferModal();
    }
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

  const transferSourceAccount = useMemo(
    () => accounts.find((account) => account.id === transferFromAccountId),
    [accounts, transferFromAccountId],
  );

  const transferDestinationAccounts = useMemo(
    () => accounts.filter((account) => account.id !== transferFromAccountId),
    [accounts, transferFromAccountId],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Administração</Text>

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
                secondaryActionIcon="swap-horiz"
                secondaryActionColor={colors.primary}
                onSecondaryAction={() => handleOpenTransferModal(account.id)}
                onDelete={() => handleDeletePress(account.id, 'account')}
                onEdit={() => handleEditAccount(account.id)}
              />
            ))}
          </View>
        </View>

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

      <Modal visible={transferModalVisible} animationType="slide" onRequestClose={handleCloseTransferModal}>
        <LinearGradient colors={[colors.backgroundSecondary, colors.backgroundTertiary]} style={styles.container}>
          <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top', 'bottom']}>
            <View style={styles.transferHeader}>
              <Text style={[styles.transferHeaderTitle, { color: colors.text }]}>Transferir saldo</Text>
              <TouchableOpacity onPress={handleCloseTransferModal} style={styles.transferCloseButton}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.transferScrollContent} showsVerticalScrollIndicator={false}>
              <View style={styles.valueSection}>
                <Text style={[styles.valueLabel, { color: colors.textTertiary }]}>Valor da transferência</Text>
                <View style={styles.valueInputContainer}>
                  <Text style={[styles.currencySymbol, { color: colors.textTertiary }]}>R$</Text>
                  <TextInput
                    style={[styles.valueInput, { color: colors.text }]}
                    placeholder="0,00"
                    placeholderTextColor={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                    value={transferAmount}
                    onChangeText={setTransferAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.formGrid}>
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
                      borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)',
                    },
                  ]}
                >
                  <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Conta de origem</Text>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {transferSourceAccount?.name || 'Conta não encontrada'}
                  </Text>
                  <Text style={[styles.cardSupportText, { color: colors.textSecondary }]}>
                    {transferSourceAccount ? formatCurrency(transferSourceAccount.balance) : '--'}
                  </Text>
                </View>

                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
                      borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)',
                    },
                  ]}
                >
                  <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Conta de destino</Text>
                  <View style={styles.destinationList}>
                    {transferDestinationAccounts.length > 0 ? (
                      transferDestinationAccounts.map((account) => {
                        const isSelected = transferToAccountId === account.id;
                        return (
                          <TouchableOpacity
                            key={account.id}
                            style={[
                              styles.destinationOption,
                              {
                                backgroundColor: isSelected
                                  ? colors.primaryLight
                                  : isDark
                                    ? colors.surfaceContainerHigh
                                    : '#F0F0F0',
                                borderColor: isSelected ? colors.primary : 'transparent',
                              },
                            ]}
                            onPress={() => setTransferToAccountId(account.id)}
                          >
                            <View style={styles.destinationOptionContent}>
                              <Text style={[styles.destinationOptionTitle, { color: colors.text }]}>
                                {account.name}
                              </Text>
                              <Text style={[styles.destinationOptionSubtitle, { color: colors.textSecondary }]}>
                                {accountTypeMap[account.type] || account.type}
                              </Text>
                            </View>
                            <Text style={[styles.destinationOptionBalance, { color: colors.text }]}>
                              {formatCurrency(account.balance)}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                        Cadastre ao menos duas contas para transferir saldo.
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor:
                      transferDestinationAccounts.length > 0 ? colors.primary : colors.surfaceContainerHighest,
                  },
                ]}
                onPress={handleConfirmTransfer}
                disabled={transferDestinationAccounts.length === 0}
              >
                <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>Transferir</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </Modal>
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
  transferHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  transferHeaderTitle: {
    ...typography.subtitle,
    fontWeight: 'bold',
  },
  transferCloseButton: {
    padding: 8,
    marginLeft: -8,
  },
  transferScrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  valueSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  valueLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  valueInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  valueInput: {
    fontSize: 60,
    fontWeight: '900',
    minWidth: 150,
    textAlign: 'center',
    paddingVertical: 0,
    includeFontPadding: false,
  },
  formGrid: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  cardTitle: {
    ...typography.subtitle,
    fontWeight: '700',
  },
  cardSupportText: {
    ...typography.small,
    marginTop: 6,
  },
  destinationList: {
    gap: 12,
  },
  destinationOption: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  destinationOptionContent: {
    flex: 1,
  },
  destinationOptionTitle: {
    ...typography.body,
    fontWeight: '700',
  },
  destinationOptionSubtitle: {
    ...typography.small,
    marginTop: 2,
  },
  destinationOptionBalance: {
    ...typography.small,
    fontWeight: '700',
  },
  emptyStateText: {
    ...typography.small,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 32,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: '800',
  },
});

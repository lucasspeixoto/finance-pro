/* eslint-disable max-len */
import { ThemeColors } from '@/src/core/theme/theme.colors';
import { typography } from '@/src/core/theme/theme.typography';
import { TransactionWithCategory } from '@/src/data/services/transactions/transactions-service';
import { MaterialIconName } from '@/src/domain/models/icon/material';
import { TransactionRow } from '@/src/ui/transactions/components/TransactionRow';
import { formatCurrency } from '@/src/utils/currency';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface RecentTransactionsCardProps {
  transactions: TransactionWithCategory[];
  colors: ThemeColors;
  onSeeAll: () => void;
}

export const RecentTransactionsCard: React.FC<RecentTransactionsCardProps> = ({ transactions, colors, onSeeAll }) => {
  return (
    <View style={[styles.bentoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Transações Recentes</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver Tudo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.transactionsList}>
        {transactions.length > 0 ? (
          transactions.map((tx) => (
            <TransactionRow
              key={tx.id}
              icon={(tx.categories?.icon || (tx.type === 'income' ? 'trending-up' : 'receipt')) as MaterialIconName}
              title={tx.description || tx.categories?.name || 'Transação'}
              subtitle={`${tx.categories?.name || 'Sem categoria'} • ${new Date(tx.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`}
              amount={`${tx.type === 'income' ? '+' : '-'} ${formatCurrency(tx.amount)}`}
              amountColor={tx.type === 'income' ? colors.success : colors.danger}
              iconColor={tx.categories?.color || (tx.type === 'income' ? colors.success : colors.primary)}
            />
          ))
        ) : (
          <Text style={{ color: colors.textTertiary, textAlign: 'center', marginVertical: 16 }}>
            Nenhuma transação recente
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bentoCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 24,
    marginBottom: 24,
  },
  cardTitle: {
    ...typography.subtitle,
  },
  seeAllText: {
    ...typography.smallMedium,
    textTransform: 'uppercase',
  },
  transactionsList: {
    gap: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
});

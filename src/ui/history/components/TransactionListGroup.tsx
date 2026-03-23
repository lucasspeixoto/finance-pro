import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/core/theme/theme.typography';
import { ThemeColors } from '@/src/core/theme/theme.colors';
import { SwipeableTransactionRow } from './SwipeableTransactionRow';
import { formatCurrency } from '@/src/utils/currency';
import { MaterialIconName } from '@/src/domain/models/icon/material';
import { TransactionWithCategory } from '@/src/data/services/transactions/transactions-service';

interface TransactionListGroupProps {
  title: string;
  data: TransactionWithCategory[];
  colors: ThemeColors;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const TransactionListGroup: React.FC<TransactionListGroupProps> = ({
  title,
  data,
  colors,
  onDelete,
  onEdit,
}) => {
  const total = data.reduce((acc, tx) => acc + (tx.type === 'expense' ? -tx.amount : tx.amount), 0);

  return (
    <View style={styles.groupContainer}>
      <View style={styles.groupHeader}>
        <Text style={[styles.groupTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.groupTotal, { color: colors.textTertiary }]}>
          {formatCurrency(total)}
        </Text>
      </View>
      <View style={styles.transactionsList}>
        {data.map((tx) => (
          <SwipeableTransactionRow
            key={tx.id}
            icon={(tx.categories?.icon || 'receipt') as MaterialIconName}
            title={tx.description || tx.categories?.name || 'Transação'}
            subtitle={`${tx.categories?.name || 'Sem categoria'}`}
            amount={`${tx.type === 'income' ? '+' : '-'} ${formatCurrency(tx.amount)}`}
            amountColor={tx.type === 'income' ? colors.success : colors.danger}
            iconColor={tx.categories?.color || (tx.type === 'income' ? colors.success : colors.primary)}
            onDelete={() => onDelete(tx.id)}
            onEdit={() => onEdit(tx.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

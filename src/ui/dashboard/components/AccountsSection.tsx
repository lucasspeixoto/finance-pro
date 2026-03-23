import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { typography } from '@/src/core/theme/theme.typography';
import { ThemeColors } from '@/src/core/theme/theme.colors';
import { AccountCard } from '@/src/ui/transactions/components/AccountCard';
import { formatCurrency } from '@/src/utils/currency';
import { Account } from '@/src/domain/models/accounts/account.model';

interface AccountsSectionProps {
  accounts: Account[];
  colors: ThemeColors;
  isDark: boolean;
}

export const AccountsSection: React.FC<AccountsSectionProps> = ({
  accounts,
  colors,
  isDark,
}) => {
  return (
    <View
      style={[styles.accountsSection, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}
    >
      <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 16 }]}>Minhas Contas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accountsScroll}>
        {accounts.length > 0 ? (
          [...accounts]
            .sort((a, b) => Number(b.balance) - Number(a.balance))
            .map(acc => (
              <AccountCard
                key={acc.id}
                name={acc.name}
                balance={formatCurrency(acc.balance)}
                borderColor={acc.color || (isDark ? colors.border : colors.primary)}
              />
            ))
        ) : (
          <Text style={{ color: colors.textTertiary, padding: 16 }}>
            Nenhuma conta encontrada
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  accountsSection: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  cardTitle: {
    ...typography.subtitle,
  },
  accountsScroll: {
    gap: 16,
  },
});

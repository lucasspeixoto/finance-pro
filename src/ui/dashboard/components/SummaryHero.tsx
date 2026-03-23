import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { typography } from '@/src/core/theme/theme.typography';
import { ThemeColors } from '@/src/core/theme/theme.colors';
import { formatCurrency } from '@/src/utils/currency';

interface SummaryHeroProps {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  colors: ThemeColors;
  isDark: boolean;
}

export const SummaryHero: React.FC<SummaryHeroProps> = ({
  totalBalance,
  monthlyIncome,
  monthlyExpense,
  colors,
  isDark,
}) => {
  return (
    <LinearGradient
      colors={[colors.primaryContainer, isDark ? colors.background : colors.primaryLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.heroSection}
    >
      <View style={styles.heroContent}>
        <Text style={[styles.heroLabel, { color: isDark ? colors.onPrimaryContainer : colors.textSecondary }]}>
          Patrimônio Total
        </Text>
        <Text style={[styles.heroBalance, { color: colors.primary }]}>
          {formatCurrency(totalBalance)}
        </Text>

        <View style={styles.heroStatsContainer}>
          <View
            style={[
              styles.heroStatBox,
              { backgroundColor: isDark ? 'rgba(17, 20, 20, 0.3)' : 'rgba(255, 255, 255, 0.5)' },
            ]}
          >
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Receita Mensal</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              + {formatCurrency(monthlyIncome)}
            </Text>
          </View>
          <View
            style={[
              styles.heroStatBox,
              { backgroundColor: isDark ? 'rgba(17, 20, 20, 0.3)' : 'rgba(255, 255, 255, 0.5)' },
            ]}
          >
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Despesa Mensal</Text>
            <Text style={[styles.statValue, { color: colors.tertiary }]}>
              - {formatCurrency(monthlyExpense)}
            </Text>
          </View>
        </View>
      </View>
      <View style={[styles.heroDecorative, { backgroundColor: colors.primary, opacity: 0.1 }]} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  heroSection: {
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 20,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  heroContent: {
    zIndex: 10,
  },
  heroDecorative: {
    position: 'absolute',
    right: -80,
    top: -80,
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  heroLabel: {
    ...typography.small,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroBalance: {
    ...typography.largeTitle,
  },
  heroStatsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 32,
  },
  heroStatBox: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
  },
  statLabel: {
    ...typography.small,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  statValue: {
    ...typography.small,
    fontWeight: '600',
  },
});

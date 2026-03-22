import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import type { MaterialIconName } from '@/src/domain/models/icon/material';
import { useDashboard } from '@/src/ui/dashboard/view-models/useDashboard';
import { AccountCard } from '@/src/ui/transactions/components/AccountCard';
import { TransactionRow } from '@/src/ui/transactions/components/TransactionRow';
import { formatCurrency } from '@/src/utils/currency';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pie, PolarChart } from 'victory-native';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();

  const {
    totalBalance, monthlyIncome, monthlyExpense, topCategories,
    recentTransactions, accounts, fetchDashboardData
  } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {/* Hero: Total Balance */}
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
              <Text style={[styles.heroBalance, { color: isDark ? colors.primary : colors.primary }]}>
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
            {/* Decorative Element Mock */}
            <View style={[styles.heroDecorative, { backgroundColor: colors.primary, opacity: 0.1 }]} />
          </LinearGradient>

          {/* Bento Grid: Analytics & Insights */}
          <View style={styles.bentoGrid}>
            {/* Category Distribution */}
            <View
              style={[
                styles.bentoCard,
                styles.categoryCard,
                { backgroundColor: colors.surfaceContainer, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Gastos por Categoria</Text>
                <MaterialIcons name="pie-chart" size={24} color={colors.textTertiary} />
              </View>

              {/* Live Pie Chart */}
              <View style={styles.donutContainer}>
                {topCategories.length > 0 ? (
                  <View style={styles.chartWrapper}>
                    <PolarChart
                      data={topCategories.map((cat, i) => ({
                        label: cat.name,
                        value: cat.amount,
                        color: cat.color || (i === 0 ? colors.primary : i === 1 ? colors.tertiary : colors.danger)
                      }))}
                      colorKey={"color"}
                      valueKey={"value"}
                      labelKey={"label"}
                    >
                      <Pie.Chart innerRadius={65} />
                    </PolarChart>
                    <View style={styles.donutOverlay} pointerEvents="none">
                      <Text style={[styles.donutTotal, { color: colors.text }]} numberOfLines={1} adjustsFontSizeToFit>
                        {formatCurrency(monthlyExpense)}
                      </Text>
                      <Text style={[styles.donutLabel, { color: colors.textTertiary }]}>TOTAL</Text>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.donutPlaceholder, { borderColor: colors.border }]}>
                    <MaterialIcons name="pie-chart-outline" size={48} color={colors.textTertiary} />
                    <Text style={[styles.donutLabel, { color: colors.textTertiary, marginTop: 8 }]}>SEM DADOS</Text>
                  </View>
                )}
              </View>

              <View style={styles.categoryList}>
                {topCategories.length > 0 ? (
                  topCategories.map((cat, index) => (
                    <View key={cat.id || index} style={styles.categoryRow}>
                      <View style={styles.categoryRowLeft}>
                        <View style={[styles.dot, { backgroundColor: cat.color || (index === 0 ? colors.primary : index === 1 ? colors.tertiary : colors.danger) }]} />
                        <Text style={[styles.categoryName, { color: colors.textSecondary }]}>{cat.name}</Text>
                      </View>
                      <Text style={[styles.categoryPercentage, { color: colors.text }]}>{cat.percentage}%</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: colors.textTertiary, textAlign: 'center', marginTop: 8 }}>Sem gastos no período</Text>
                )}
              </View>
            </View>

            {/* Recent Transactions */}
            <View
              style={[
                styles.bentoCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Transações Recentes</Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver Tudo</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.transactionsList}>
                {recentTransactions.length > 0 ? (
                  recentTransactions.map(tx => (
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
          </View>

          {/* Accounts Preview */}
          <View
            style={[styles.accountsSection, { backgroundColor: colors.surfaceContainer, borderColor: colors.border }]}
          >
            <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 16 }]}>Minhas Contas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accountsScroll}>
              {accounts.length > 0 ? (
                accounts.map(acc => (
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
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(modals)/add-transaction')}
      >
        <MaterialIcons name="add" size={28} color={isDark ? colors.background : colors.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 32,
    marginTop: 16,
  },
  heroSection: {
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 10,
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
  },
  bentoGrid: {
    gap: 24,
  },
  bentoCard: {
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  categoryCard: {
    alignItems: 'center',
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
  donutContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartWrapper: {
    width: 180,
    height: 180,
    position: 'relative',
  },
  donutOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  donutPlaceholder: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  donutTotal: {
    ...typography.subtitle,
    fontWeight: '800',
  },
  donutLabel: {
    ...typography.extraSmall,
    letterSpacing: 1,
    opacity: 0.6,
  },
  categoryList: {
    width: '100%',
    marginTop: 24,
    gap: 8,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  categoryRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryName: {
    ...typography.small,
  },
  categoryPercentage: {
    ...typography.smallMedium,
  },
  transactionsList: {
    gap: 24,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  accountsSection: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
  },
  accountsScroll: {
    gap: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 12,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

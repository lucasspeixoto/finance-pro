import React, { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useTheme } from '@/src/core/theme/theme.hooks';
import { useDashboard } from '@/src/ui/dashboard/view-models/useDashboard';
import { SummaryHero } from '@/src/ui/dashboard/components/SummaryHero';
import { ExpenseCategoriesCard } from '@/src/ui/dashboard/components/ExpenseCategoriesCard';
import { RecentTransactionsCard } from '@/src/ui/dashboard/components/RecentTransactionsCard';
import { AccountsSection } from '@/src/ui/dashboard/components/AccountsSection';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();

  const {
    totalBalance,
    monthlyIncome,
    monthlyExpense,
    topCategories,
    recentTransactions,
    accounts,
    fetchDashboardData,
  } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          <SummaryHero
            totalBalance={totalBalance}
            monthlyIncome={monthlyIncome}
            monthlyExpense={monthlyExpense}
            colors={colors}
            isDark={isDark}
          />

          <View style={styles.contentLayout}>
            <ExpenseCategoriesCard topCategories={topCategories} monthlyExpense={monthlyExpense} colors={colors} />

            <RecentTransactionsCard
              transactions={recentTransactions}
              colors={colors}
              onSeeAll={() => router.push('/(tabs)/history')}
            />

            <AccountsSection accounts={accounts} colors={colors} isDark={isDark} />
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
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  mainContent: {
    paddingHorizontal: 24,
    gap: 32,
    marginTop: 16,
  },
  contentLayout: {
    gap: 24,
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

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Pie, PolarChart } from 'victory-native';
import { typography } from '@/src/core/theme/theme.typography';
import { ThemeColors } from '@/src/core/theme/theme.colors';
import { formatCurrency } from '@/src/utils/currency';
import { CategoryExpense } from '../stores/dashboard-store';

interface ExpenseCategoriesCardProps {
  topCategories: CategoryExpense[];
  monthlyExpense: number;
  colors: ThemeColors;
}

export const ExpenseCategoriesCard: React.FC<ExpenseCategoriesCardProps> = ({
  topCategories,
  monthlyExpense,
  colors,
}) => {
  return (
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

      <View style={styles.donutContainer}>
        {topCategories.length > 0 ? (
          <View style={styles.chartWrapper}>
            <PolarChart
              data={topCategories.map((cat, i) => ({
                label: cat.name,
                value: cat.amount,
                color: cat.color || (i === 0 ? colors.primary : i === 1 ? colors.tertiary : colors.danger),
              }))}
              colorKey={'color'}
              valueKey={'value'}
              labelKey={'label'}
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
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        cat.color || (index === 0 ? colors.primary : index === 1 ? colors.tertiary : colors.danger),
                    },
                  ]}
                />
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
  );
};

const styles = StyleSheet.create({
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
    gap: 12,
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
});

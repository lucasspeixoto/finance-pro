import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import type { MaterialIconName } from '@/src/domain/models/icon/material';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TransactionRowProps {
  icon: MaterialIconName;
  title: string;
  subtitle: string;
  amount: string;
  amountColor: string;
  iconColor?: string;
}

export function TransactionRow({ icon, title, subtitle, amount, amountColor, iconColor }: TransactionRowProps) {
  const { colors } = useTheme();
  const defaultIconColor = colors.text;

  return (
    <View style={styles.txRow}>
      <View style={styles.txLeft}>
        <View style={[styles.txIconContainer, { backgroundColor: colors.borderLight }]}>
          <MaterialIcons name={icon} size={24} color={iconColor || defaultIconColor} />
        </View>
        <View style={styles.txTextContainer}>
          <Text style={[styles.txTitle, { color: colors.text }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.txSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
        </View>
      </View>
      <Text style={[styles.txAmount, { color: amountColor }]}>{amount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    flex: 1,
    marginRight: 2,


  },
  txTextContainer: {
    flex: 1,

  },
  txIconContainer: {
    width: 32,
    height: 32,
    marginRight: 2,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txTitle: {
    ...typography.captionMedium,
    marginBottom: 2,
  },
  txSubtitle: {
    ...typography.small,
  },
  txAmount: {
    ...typography.small,
  },
});

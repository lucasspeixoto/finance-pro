import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import type { MaterialIconName } from '@/src/domain/models/icon/material';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface SwipeableTransactionRowProps {
  icon: MaterialIconName;
  title: string;
  subtitle: string;
  amount: string;
  amountColor: string;
  iconColor?: string;
  onDelete: () => void;
  onEdit: () => void;
}

export function SwipeableTransactionRow({
  icon,
  title,
  subtitle,
  amount,
  amountColor,
  iconColor,
  onDelete,
  onEdit,
}: SwipeableTransactionRowProps) {
  const { colors, isDark } = useTheme();

  const renderLeftActions = (_prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value - 80 }],
      };
    });

    return (
      <Reanimated.View style={[styles.leftAction, styleAnimation]}>
        <RectButton
          style={[styles.actionButton, { backgroundColor: colors.danger }]}
          onPress={onDelete}
        >
          <MaterialIcons name="delete" size={24} color={isDark ? colors.background : colors.surface} />
        </RectButton>
      </Reanimated.View>
    );
  };

  const renderRightActions = (_prog: SharedValue<number>, drag: SharedValue<number>) => {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 80 }],
      };
    });

    return (
      <Reanimated.View style={[styles.rightAction, styleAnimation]}>
        <RectButton
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onEdit}
        >
          <MaterialIcons name="edit" size={24} color={isDark ? colors.onPrimary : colors.surface} />
        </RectButton>
      </Reanimated.View>
    );
  };

  return (
    <ReanimatedSwipeable
      friction={2}
      enableTrackpadTwoFingerGesture
      leftThreshold={40}
      rightThreshold={40}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
    >
      <View style={[styles.container, { backgroundColor: colors.surfaceContainer }]}>
        <View style={styles.leftContent}>
          <View style={[styles.iconContainer, { backgroundColor: colors.backgroundSecondary }]}>
            <MaterialIcons name={icon} size={24} color={iconColor || colors.primary} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>{title}</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]} numberOfLines={1}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <Text style={[styles.amount, { color: amountColor }]}>{amount}</Text>
        </View>
      </View>
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    ...typography.subtitle,
    fontWeight: 'bold',
  },
  subtitle: {
    ...typography.small,
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  amount: {
    ...typography.subtitle,
    fontWeight: 'bold',
  },
  leftAction: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAction: {
    width: 80,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

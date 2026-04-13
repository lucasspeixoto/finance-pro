import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import { useAccounts } from '@/src/ui/accounts/view-models/useAccounts';
import { materialAccountIcons } from '@/src/shared/constants/icons';
import type { AccountType } from '@/src/domain/models/accounts/account.model';
import type { MaterialIconName } from '@/src/domain/models/icon/material';

const ACCOUNT_TYPES: { type: AccountType; label: string; icon: MaterialIconName }[] = [
  { type: 'checking', label: 'Corrente', icon: 'account-balance' },
  { type: 'savings', label: 'Poupança', icon: 'savings' },
  { type: 'cash', label: 'Dinheiro', icon: 'payments' },
  { type: 'investment', label: 'Investimento', icon: 'show-chart' },
  { type: 'credit_card', label: 'Cartão de Crédito', icon: 'credit-card' },
];

const PREDEFINED_COLORS = [
  '#006239', // Emerald
  '#00897B', // Teal
  '#2196F3', // Blue
  '#3F51B5', // Indigo
  '#9C27B0', // Purple
  '#E91E63', // Pink
  '#F44336', // Red
  '#FF9800', // Orange
  '#FFC107', // Amber
  '#9E9E9E', // Grey
];

export default function AddAccountScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    name,
    setName,
    type,
    setType,
    amountInput,
    setAmountInput,
    color,
    setColor,
    icon,
    setIcon,
    handleSaveAccount,
  } = useAccounts(id);

  return (
    <LinearGradient colors={[colors.backgroundSecondary, colors.backgroundTertiary]} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{id ? 'Editar Conta' : 'Nova Conta'}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Balance Section */}
          <View style={styles.valueSection}>
            <Text style={[styles.valueLabel, { color: colors.textTertiary }]}>Saldo Inicial</Text>
            <View style={styles.valueInputContainer}>
              <Text style={[styles.currencySymbol, { color: colors.textTertiary }]}>R$</Text>
              <TextInput
                style={[styles.valueInput, { color: colors.text }]}
                placeholder="0,00"
                placeholderTextColor={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                value={amountInput}
                onChangeText={setAmountInput}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formGrid}>
            {/* Account Name */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
                  borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Nome da Conta</Text>
              <TextInput
                style={[styles.cardInput, { color: colors.text }]}
                placeholder="Ex: Nubank, Carteira..."
                placeholderTextColor={colors.textTertiary}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Account Type Selector */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
                  borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Tipo de Conta</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectorScroll}
              >
                {ACCOUNT_TYPES.map((item) => {
                  const isSelected = type === item.type;
                  return (
                    <TouchableOpacity key={item.type} style={styles.selectorItem} onPress={() => setType(item.type)}>
                      <View
                        style={[
                          styles.iconWrapper,
                          {
                            backgroundColor: isSelected
                              ? colors.primary
                              : isDark
                                ? colors.surfaceContainerHigh
                                : '#F0F0F0',
                          },
                          isSelected && {
                            shadowColor: colors.primary,
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                            elevation: 5,
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={item.icon}
                          size={24}
                          color={isSelected ? '#FFFFFF' : colors.textTertiary}
                        />
                      </View>
                      <Text
                        style={[
                          styles.selectorText,
                          {
                            color: isSelected ? colors.text : colors.textTertiary,
                            fontWeight: isSelected ? '600' : '400',
                          },
                        ]}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Color Selector */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
                  borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Cor</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectorScroll}
              >
                {PREDEFINED_COLORS.map((c) => {
                  const isSelected = color === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: c },
                        isSelected && { borderWidth: 3, borderColor: colors.text },
                      ]}
                      onPress={() => setColor(c)}
                    />
                  );
                })}
              </ScrollView>
            </View>

            {/* Icon Selector */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface,
                  borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Ícone</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.selectorScroll}
              >
                {materialAccountIcons.map((iconName) => {
                  const isSelected = icon === iconName;
                  return (
                    <TouchableOpacity key={iconName} style={styles.selectorItem} onPress={() => setIcon(iconName)}>
                      <View
                        style={[
                          styles.iconWrapper,
                          { backgroundColor: isSelected ? color : isDark ? colors.surfaceContainerHigh : '#F0F0F0' },
                        ]}
                      >
                        <MaterialIcons
                          name={iconName as MaterialIconName}
                          size={24}
                          color={isSelected ? '#FFFFFF' : colors.textTertiary}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSaveAccount}
          >
            <Text style={[styles.saveButtonText, { color: isDark ? '#003735' : '#FFFFFF' }]}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  closeButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    ...typography.subtitle,
    fontWeight: 'bold',
  },
  scrollContent: {
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
  cardInput: {
    ...typography.subtitle,
    padding: 0,
    margin: 0,
  },
  selectorScroll: {
    gap: 16,
    paddingBottom: 4,
  },
  selectorItem: {
    alignItems: 'center',
    gap: 8,
    width: 64,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorText: {
    fontSize: 10,
    textAlign: 'center',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  saveButton: {
    marginTop: 32,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: '800',
  },
});

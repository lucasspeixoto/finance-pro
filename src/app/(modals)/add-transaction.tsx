import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import type { MaterialIconName } from '@/src/domain/models/icon/material';
import { useAddTransaction } from '@/src/ui/transactions/view-models/useAddTransaction';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddTransactionScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const {
    type,
    setType,
    amountInput,
    setAmountInput,
    description,
    setDescription,
    date,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    isPaid,
    setIsPaid,
    categories,
    accounts,
    selectedCategoryId,
    setSelectedCategoryId,
    selectedAccountId,
    setSelectedAccountId,
    handleSave,
  } = useAddTransaction(id);

  // Filter categories based on transaction type
  const availableCategories = categories.filter(c => c.type === type);

  return (
    <LinearGradient colors={[colors.backgroundSecondary, colors.backgroundTertiary]} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{id ? 'Editar Transação' : 'Nova Transação'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Value Input */}
        <View style={styles.valueSection}>
          <Text style={[styles.valueLabel, { color: colors.textTertiary }]}>Valor da Transação</Text>
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

        {/* Transaction Type Selector */}
        <View style={[styles.typeSelectorContainer, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface }]}>
          {(['expense', 'income', 'transfer'] as const).map((t) => {
            const isSelected = type === t;
            const labels = { expense: 'Despesa', income: 'Receita', transfer: 'Transferir' };
            return (
              <TouchableOpacity
                key={t}
                style={[
                  styles.typeButton,
                  isSelected && { backgroundColor: isDark ? colors.primaryContainer : colors.primaryLight, shadowColor: colors.primary },
                  isSelected && styles.typeButtonSelected
                ]}
                onPress={() => setType(t)}
              >
                <Text style={[
                  styles.typeButtonText,
                  { color: isSelected ? (isDark ? colors.onPrimaryContainer : colors.primary) : colors.textTertiary }
                ]}>
                  {labels[t]}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        {/* Grid Container */}
        <View style={styles.formGrid}>
          {/* Description */}
          <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}>
            <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Descrição</Text>
            <TextInput
              style={[styles.cardInput, { color: colors.text }]}
              placeholder="O que você comprou?"
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.rowCards}>
            {/* Date */}
            <TouchableOpacity
              style={[styles.card, styles.halfCard, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.7}
            >
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Data</Text>
              <View style={styles.dateContainer}>
                <MaterialIcons name="calendar-today" size={20} color={colors.primary} />
                <Text style={[typography.captionMedium, { color: colors.text, flex: 1, marginLeft: 8 }]}>
                  {date.toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}

            {/* Status */}
            <View style={[styles.card, styles.halfCard, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Status</Text>
              <View style={styles.statusContainer}>
                <Text style={[styles.statusText, { color: colors.text }]}>{isPaid ? 'Paga' : 'Pendente'}</Text>
                <Switch
                  value={isPaid}
                  onValueChange={setIsPaid}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={isDark ? '#E1E3E3' : '#FFFFFF'}
                />
              </View>
            </View>
          </View>

          {/* Category Selector */}
          {type !== 'transfer' ? (
            <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
                {availableCategories.map(category => {
                  const isSelected = selectedCategoryId === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.selectorItem}
                      onPress={() => setSelectedCategoryId(category.id)}
                    >
                      <View style={[
                        styles.iconContainer,
                        { backgroundColor: isSelected ? category.color || colors.primary : (isDark ? colors.surfaceContainerHigh : '#F0F0F0') },
                        isSelected && { shadowColor: category.color || colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }
                      ]}>
                        <MaterialIcons
                          name={(category.icon as MaterialIconName) || 'category'}
                          size={24}
                          color={isSelected ? '#FFFFFF' : colors.textTertiary}
                        />
                      </View>
                      <Text style={[
                        styles.selectorText,
                        { color: isSelected ? colors.text : colors.textTertiary, fontWeight: isSelected ? '600' : '400' }
                      ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          {/* Account Selector */}
          <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}>
            <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Conta</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
              {accounts.map(account => {
                const isSelected = selectedAccountId === account.id;
                return (
                  <TouchableOpacity
                    key={account.id}
                    style={styles.selectorItem}
                    onPress={() => setSelectedAccountId(account.id)}
                  >
                    <View style={[
                      styles.iconContainer,
                      { backgroundColor: isSelected ? account.color || colors.primary : (isDark ? colors.surfaceContainerHigh : '#F0F0F0') },
                      isSelected && { shadowColor: account.color || colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }
                    ]}>
                      <MaterialIcons
                        name={(account.icon as MaterialIconName) || "account-balance"}
                        size={24}
                        color={isSelected ? '#FFFFFF' : colors.textTertiary}
                      />
                    </View>
                    <Text style={[
                      styles.selectorText,
                      { color: isSelected ? colors.text : colors.textTertiary, fontWeight: isSelected ? '600' : '400' }
                    ]}>
                      {account.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSave}>
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
  typeSelectorContainer: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 12,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonSelected: {
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  typeButtonText: {
    ...typography.smallMedium,
    fontWeight: 'bold',
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
    marginBottom: 8,
  },
  cardInput: {
    ...typography.subtitle,
    padding: 0,
    margin: 0,
  },
  rowCards: {
    flexDirection: 'row',
    gap: 16,
  },
  halfCard: {
    flex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32, // Controlled height to match status container
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 32, // Fixed height to ensure alignment with Date container
  },
  statusText: {
    ...typography.smallMedium,
    fontWeight: 'bold',
  },
  selectorScroll: {
    gap: 16,
    paddingBottom: 8,
  },
  selectorItem: {
    alignItems: 'center',
    gap: 8,
    width: 64,
  },
  iconContainer: {
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

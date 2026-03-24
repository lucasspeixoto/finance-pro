import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import { useCategories } from '@/src/ui/categories/view-models/useCategories';
import { materialCategoryIcons } from '@/src/shared/constants/icons';
import type { CategoryType } from '@/src/domain/models/categories/category.model';
import type { MaterialIconName } from '@/src/domain/models/icon/material';

const CATEGORY_TYPES: { type: CategoryType; label: string; icon: MaterialIconName }[] = [
  { type: 'expense', label: 'Despesa', icon: 'trending-down' },
  { type: 'income', label: 'Receita', icon: 'trending-up' },
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

export default function AddCategoryScreen() {
  const { colors, isDark } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const {
    name,
    setName,
    type,
    setType,
    color,
    setColor,
    icon,
    setIcon,
    handleSaveCategory,
  } = useCategories(id);

  return (
    <LinearGradient colors={[colors.backgroundSecondary, colors.backgroundTertiary]} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{id ? 'Editar Categoria' : 'Nova Categoria'}</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Name Input */}
          <View style={styles.inputSection}>
            <Text style={[styles.inputLabel, { color: colors.textTertiary }]}>Nome da Categoria</Text>
            <TextInput
              style={[styles.mainInput, { color: colors.text }]}
              placeholder="Ex: Alimentação, Lazer..."
              placeholderTextColor={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
              value={name}
              onChangeText={setName}
              autoFocus={!id}
            />
          </View>

          {/* Form Fields */}
          <View style={styles.formGrid}>
            {/* Category Type Selector */}
            <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Tipo</Text>
              <View style={styles.typeSelector}>
                {CATEGORY_TYPES.map(item => {
                  const isSelected = type === item.type;
                  return (
                    <TouchableOpacity
                      key={item.type}
                      style={[
                        styles.typeItem,
                        { backgroundColor: isSelected ? (item.type === 'expense' ? colors.tertiary : colors.primary) : (isDark ? colors.surfaceContainerHigh : '#F0F0F0') },
                        isSelected && { shadowColor: item.type === 'expense' ? colors.tertiary : colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 }
                      ]}
                      onPress={() => setType(item.type)}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={20}
                        color={isSelected ? '#FFFFFF' : colors.textTertiary}
                      />
                      <Text style={[
                        styles.typeText,
                        { color: isSelected ? '#FFFFFF' : colors.textTertiary, fontWeight: isSelected ? '700' : '500' }
                      ]}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Color Selector */}
            <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Cor Personalizada</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
                {PREDEFINED_COLORS.map(c => {
                  const isSelected = color === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: c },
                        isSelected && { borderWidth: 3, borderColor: isDark ? '#FFFFFF' : colors.text }
                      ]}
                      onPress={() => setColor(c)}
                    />
                  );
                })}
              </ScrollView>
            </View>

            {/* Icon Selector */}
            <View style={[styles.card, { backgroundColor: isDark ? colors.surfaceContainerLow : colors.surface, borderColor: isDark ? colors.border : 'rgba(0,0,0,0.05)' }]}>
              <Text style={[styles.cardLabel, { color: colors.textTertiary }]}>Ícone representativo</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectorScroll}>
                {materialCategoryIcons.map(iconName => {
                  const isSelected = icon === iconName;
                  return (
                    <TouchableOpacity
                      key={iconName}
                      style={[
                        styles.iconItem,
                        { backgroundColor: isSelected ? color : (isDark ? colors.surfaceContainerHigh : '#F0F0F0') },
                      ]}
                      onPress={() => setIcon(iconName)}
                    >
                      <MaterialIcons
                        name={iconName as MaterialIconName}
                        size={24}
                        color={isSelected ? '#FFFFFF' : colors.textTertiary}
                      />
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: colors.primary }]} onPress={handleSaveCategory}>
            <Text style={[styles.saveButtonText, { color: isDark ? '#003735' : '#FFFFFF' }]}>
              {id ? 'Confirmar Alterações' : 'Criar Categoria'}
            </Text>
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
  inputSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  inputLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  mainInput: {
    fontSize: 28,
    fontWeight: '800',
    width: '100%',
    textAlign: 'center',
    paddingVertical: 8,
  },
  formGrid: {
    gap: 16,
  },
  card: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  cardLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    fontWeight: '600',
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  typeText: {
    fontSize: 14,
  },
  selectorScroll: {
    gap: 12,
    paddingBottom: 4,
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  iconItem: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  saveButton: {
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});

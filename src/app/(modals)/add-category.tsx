import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';

export default function AddCategoryScreen() {
  const { colors } = useTheme();

  return (
    <LinearGradient colors={[colors.backgroundSecondary, colors.backgroundTertiary]} style={styles.container}>
      <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Nova Categoria</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      <View style={styles.content}>
        <Text style={{ color: colors.textSecondary }}>Formulário de categoria será implementado aqui.</Text>
      </View>
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
    paddingHorizontal: 16,
    height: 56,
  },
  closeButton: {
    padding: 8,
  },
  title: {
    ...typography.subtitle,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
});

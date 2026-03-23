import { useTheme } from '@/src/core/theme/theme.hooks';
import { typography } from '@/src/core/theme/theme.typography';
import { useAuth } from '@/src/ui/auth/view-models/useAuth';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);
  const [showThemeModal, setShowThemeModal] = useState(false);

  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={[styles.profileCard, { backgroundColor: colors.surfaceContainer }]}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Image
                  source={{
                    uri: 'https://cumkqrjwsbyotaojeyxv.supabase.co/storage/v1/object/public/avatars/8fd76563-65b1-47ea-a1a4-931be800ed45.jpeg',
                  }}
                  style={[styles.avatar, { borderColor: colors.primary + '4D' }]}
                />
                <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                  <MaterialIcons name="edit" size={12} color={colors.onPrimaryContainer || '#000'} />
                </View>
              </View>
              <View>
                <Text style={[typography.subtitle, { color: colors.text, fontSize: 20 }]}>Lucas Peixoto</Text>
                <Text style={[typography.small, { color: colors.textSecondary }]}>lspeixotodev@gmail.com</Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.8}>
              <Text style={[typography.button, { color: colors.primary, fontSize: 14 }]}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences Group */}
        <View style={styles.groupContainer}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>PREFERÊNCIAS</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="category" size={20} color={colors.primary} />
                </View>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>Categorias</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="payments" size={20} color={colors.primary} />
                </View>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>Moeda Principal</Text>
              </View>
              <Text style={[typography.subtitle, { color: colors.primary, fontWeight: '700' }]}>BRL R$</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity 
              style={styles.rowItem} 
              activeOpacity={0.7}
              onPress={() => setShowThemeModal(true)}
            >
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="dark-mode" size={20} color={colors.primary} />
                </View>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>Tema</Text>
              </View>
              <Text style={[typography.body, { color: colors.textSecondary }]}>
                {themeMode === 'light' ? 'Claro' : themeMode === 'dark' ? 'Escuro' : 'Sistema'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Security Group */}
        <View style={styles.groupContainer}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>SEGURANÇA</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="lock" size={20} color={colors.primary} />
                </View>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>Alterar Senha</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.rowItem}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="fingerprint" size={20} color={colors.primary} />
                </View>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>Autenticação Biométrica</Text>
              </View>
              <Switch
                value={isBiometricEnabled}
                onValueChange={setIsBiometricEnabled}
                trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
                thumbColor={'#FFFFFF'}
              />
            </View>
          </View>
        </View>

        {/* Support Group */}
        <View style={styles.groupContainer}>
          <Text style={[styles.groupTitle, { color: colors.textSecondary }]}>SUPORTE</Text>
          <View style={[styles.groupCard, { backgroundColor: colors.card }]}>
            <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="help" size={20} color={colors.primary} />
                </View>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>Ajuda e FAQ</Text>
              </View>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.surfaceVariant }]}>
                  <MaterialIcons name="description" size={20} color={colors.primary} />
                </View>
                <Text style={[typography.bodyMedium, { color: colors.text }]}>Termos de Uso e Privacidade</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Section */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: colors.dangerLight, borderColor: colors.danger + '4D' }]}
            activeOpacity={0.8}
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color={colors.danger} />
            <Text style={[typography.button, { color: colors.danger, marginLeft: 12 }]}>Sair da conta</Text>
          </TouchableOpacity>
          <Text style={[typography.small, styles.versionText, { color: colors.textTertiary }]}>
            FINANCEPRO V1.0.0 BUILD {new Date().getFullYear()}
          </Text>
        </View>
      </ScrollView>

      {/* Theme Selection Modal */}
      {showThemeModal && (
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowThemeModal(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Selecionar Tema</Text>
            
            {[
              { label: 'Claro', value: 'light', icon: 'light-mode' },
              { label: 'Escuro', value: 'dark', icon: 'dark-mode' },
              { label: 'Sistema', value: 'system', icon: 'settings-brightness' },
            ].map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.modalOption}
                onPress={() => {
                  setThemeMode(item.value as any);
                  setShowThemeModal(false);
                }}
              >
                <View style={styles.rowLeft}>
                  <MaterialIcons 
                    name={item.icon as any} 
                    size={24} 
                    color={themeMode === item.value ? colors.primary : colors.textSecondary} 
                  />
                  <Text style={[
                    styles.modalOptionText, 
                    { color: themeMode === item.value ? colors.primary : colors.text }
                  ]}>
                    {item.label}
                  </Text>
                </View>
                {themeMode === item.value && (
                  <MaterialIcons name="check" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120, // Enough room for BottomNavBar
    gap: 40,
  },
  profileSection: {
    gap: 24,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    borderRadius: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  groupContainer: {
    gap: 16,
  },
  groupTitle: {
    ...typography.small,
    fontWeight: '700',
    letterSpacing: 1.5,
    paddingHorizontal: 8,
  },
  groupCard: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  logoutSection: {
    paddingTop: 24,
    gap: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  versionText: {
    textAlign: 'center',
    letterSpacing: 2,
    opacity: 0.6,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 48,
  },
  modalTitle: {
    ...typography.subtitle,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  modalOptionText: {
    ...typography.bodyMedium,
    fontSize: 18,
    fontWeight: '600',
  },
});

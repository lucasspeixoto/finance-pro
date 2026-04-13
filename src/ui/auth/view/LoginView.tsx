import { AntDesign } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { useTheme } from '../../../core/theme/theme.hooks';
import { typography } from '../../../core/theme/theme.typography';
import { ThemedInputForm } from '../../shared/components/input/ThemedInputForm';
import { useAuth } from '../view-models/useAuth';

const schema = z.object({
  email: z
    .string({
      error: 'O email é obrigatório!',
    })
    .nonempty('O email é obrigatório!'),
  password: z
    .string({
      error: 'A senha é obrigatória!',
    })
    .nonempty('A senha é obrigatória!')
    .min(6, 'A senha deve ter pelo menos 6 caracteres!'),
});

export const LoginView = () => {
  const { signIn } = useAuth();

  const { colors } = useTheme();

  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (formData: { email: string; password: string }) => {
    const { email, password } = formData;
    await signIn(email, password);
  };

  return (
    <LinearGradient colors={[colors.backgroundSecondary, colors.backgroundTertiary]} style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
          <View style={styles.content}>
            <View style={styles.brandContainer}>
              <Text style={[styles.brandText, { color: colors.primary }]}>Finance Pro</Text>
              <Text style={[styles.titleText, { color: colors.text }]}>Bem-vindo de volta</Text>
            </View>

            <View style={styles.formContainer}>
              <View>
                <ThemedInputForm
                  control={control}
                  name="email"
                  label="Email"
                  placeholder="Digite seu email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={formState?.errors.email?.message}
                />
                <ThemedInputForm
                  control={control}
                  name="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  secureTextEntry={!showPassword}
                  error={formState?.errors.password?.message}
                  rightElement={
                    <TouchableOpacity style={styles.eyeButton} onPress={() => setShowPassword((prev) => !prev)}>
                      <AntDesign name={showPassword ? 'eye' : 'eye-invisible'} size={20} color={colors.icon} />
                    </TouchableOpacity>
                  }
                />
              </View>

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity disabled={true}>
                  <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Esqueci minha senha</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit)}
            >
              <Text style={[styles.loginButtonText, { color: colors.surface }]}>Entrar</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
  brandText: {
    ...typography.title,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  titleText: {
    ...typography.largeTitle,
  },
  formContainer: {
    marginBottom: 24,
  },
  eyeButton: {
    position: 'absolute',
    padding: 12,
    right: 6,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  label: {
    ...typography.smallMedium,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    borderRadius: 8,
    paddingHorizontal: 16,
    ...typography.body,
  },
  passwordContainer: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    ...typography.body,
  },
  visibilityButton: {
    paddingHorizontal: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    ...typography.link,
  },
  loginButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    ...typography.subtitle,
    fontWeight: '800',
  },
});

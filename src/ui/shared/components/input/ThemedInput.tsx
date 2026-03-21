import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useTheme } from '../../../../core/theme/theme.hooks';
import { typography } from '../../../../core/theme/theme.typography';

export interface ThemedInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  rightElement?: React.ReactNode;
  error?: string;
}

const ThemedInput: React.FC<ThemedInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  rightElement,
  error,
  multiline,
  numberOfLines,
  style,
  ...rest
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {label ? <Text style={[styles.label, { color: colors.textSecondary }]}>{label.toUpperCase()}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceVariant,
            borderColor: error ? colors.danger : colors.border,
            borderWidth: 1
          },
          multiline && styles.multilineContainer,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: colors.text },
            multiline && styles.multilineInput,
            style,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...rest}
        />
        {rightElement ? (
          <View style={styles.rightElementContainer}>
            {rightElement}
          </View>
        ) : null}
      </View>

      {error ? (
        <Text style={[styles.errorText, { color: colors.danger }]}>
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.smallMedium,
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
  },
  multilineContainer: {
    height: 'auto',
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    ...typography.body,
  },
  multilineInput: {
    paddingVertical: 16,
    minHeight: 120,
  },
  rightElementContainer: {
    paddingHorizontal: 16,
    justifyContent: 'center',
    height: '100%',
  },
  errorText: {
    ...typography.small,
    marginTop: 8,
    marginLeft: 4,
  },
});

export default ThemedInput;

import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../core/theme/theme.hooks';
import { typography } from '../../../core/theme/theme.typography';
import { useAlertBoxStore } from '../../hooks/use-alert-box';
import { styles } from './styles';

export const AlertBox = () => {
  const { message, isVisible, setIsVisible } = useAlertBoxStore();
  const { colors } = useTheme();

  return (
    <>
      {isVisible ? (
        <Modal transparent visible={isVisible} animationType="fade">
          <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
            <View style={[styles.alertContainer, { backgroundColor: colors.surface }]}>
              <Text style={[typography.subtitle, styles.title, { color: colors.text }]}>Atenção</Text>
              <Text style={[typography.body, styles.message, { color: colors.textSecondary }]}>{message}</Text>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: colors.primary }]}
                onPress={() => setIsVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={[typography.button, { color: colors.background }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
};

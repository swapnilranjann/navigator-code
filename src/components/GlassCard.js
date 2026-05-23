import React from 'react';
import { View, StyleSheet, BlurView } from 'react-native';
import { Colors, Spacing } from '../theme';

export const GlassCard = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)', // Note: backdropFilter doesn't work directly in RN without libraries like expo-blur
  },
  content: {
    padding: Spacing.md,
  },
});

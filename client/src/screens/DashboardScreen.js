import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../theme';
import { KtmLogo } from '../components/KtmLogo';
import { GlassCard } from '../components/GlassCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  const [navigationData, setNavigationData] = useState({
    distance: 450,
    unit: 'm',
    street: 'MG Road',
    turnIcon: 'arrow-right-top',
    connected: true,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <KtmLogo size={80} />
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: navigationData.connected ? Colors.success : Colors.error }]} />
          <Text style={styles.statusText}>{navigationData.connected ? 'CONNECTED' : 'DISCONNECTED'}</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <GlassCard style={styles.turnCard}>
          <MaterialCommunityIcons name={navigationData.turnIcon} size={120} color={Colors.primary} />
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceValue}>{navigationData.distance}</Text>
            <Text style={styles.distanceUnit}>{navigationData.unit}</Text>
          </View>
          <Text style={styles.streetName}>{navigationData.street}</Text>
        </GlassCard>

        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>SPEED</Text>
            <Text style={styles.statValue}>68</Text>
            <Text style={styles.statUnit}>km/h</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statLabel}>TIME</Text>
            <Text style={styles.statValue}>12:45</Text>
            <Text style={styles.statUnit}>PM</Text>
          </GlassCard>
        </View>
      </View>

      <TouchableOpacity style={styles.connectButton}>
        <Text style={styles.connectButtonText}>
          {navigationData.connected ? 'VIEW MAP' : 'CONNECT TO BIKE'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  turnCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.md,
  },
  distanceValue: {
    color: Colors.text,
    fontSize: 72,
    fontWeight: '900',
  },
  distanceUnit: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: Spacing.xs,
  },
  streetName: {
    color: Colors.textSecondary,
    fontSize: 20,
    fontWeight: '600',
    marginTop: Spacing.sm,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  statValue: {
    color: Colors.text,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  statUnit: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  connectButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  connectButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

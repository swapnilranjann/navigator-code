import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../theme/colors';
import { User, Sun, Navigation, Bell, BarChart3, HelpCircle, Crown, ChevronRight } from 'lucide-react-native';

const SettingItem = ({ icon: Icon, label, hasArrow = true }) => (
  <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
    <View style={styles.settingLeft}>
       <Icon size={22} color={Colors.text} />
       <Text style={styles.settingLabel}>{label}</Text>
    </View>
    {hasArrow && <ChevronRight size={20} color={Colors.textSecondary} />}
  </TouchableOpacity>
);

const SettingsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <SettingItem icon={User} label="My profile" />
        <SettingItem icon={Sun} label="Appearance" />
        <SettingItem icon={Navigation} label="Navigation" />
        <SettingItem icon={Bell} label="Alerts" />
        <SettingItem icon={BarChart3} label="Leaderboard" />
        <SettingItem icon={HelpCircle} label="Common Questions" />
        
        <TouchableOpacity style={[styles.settingItem, styles.premiumItem]} activeOpacity={0.8}>
           <View style={styles.settingLeft}>
              <Crown size={22} color={Colors.primary} />
              <Text style={[styles.settingLabel, {color: Colors.primary}]}>Premium</Text>
           </View>
           <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.versionContainer}>
           <Text style={styles.versionText}>Version: 55.0 (55)</Text>
           <View style={styles.legalLinks}>
              <Text style={styles.legalText}>Privacy Policy</Text>
              <View style={styles.dot} />
              <Text style={styles.legalText}>Terms of Service</Text>
           </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: Colors.text,
    fontSize: 18,
    marginLeft: Spacing.md,
    fontWeight: '500',
  },
  premiumItem: {
    borderBottomWidth: 0,
    marginTop: Spacing.md,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  versionText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: Spacing.sm,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legalText: {
    color: Colors.primary,
    fontSize: 14,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textSecondary,
    marginHorizontal: Spacing.sm,
  }
});

export default SettingsScreen;

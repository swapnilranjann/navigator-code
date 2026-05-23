import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../theme/colors';
import { User, Sun, Navigation, Bell, BarChart3, HelpCircle, Crown, ChevronRight, LogOut, Key, Eye, EyeOff } from 'lucide-react-native';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { changePassword } from '../utils/Api';

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);
  const { themeName: activeTheme, colors, changeTheme } = useContext(ThemeContext);
  const styles = getStyles(colors);

  const SettingItem = ({ icon: Icon, label, hasArrow = true, onPress }) => (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.settingLeft}>
         <Icon size={22} color={colors.text} />
         <Text style={styles.settingLabel}>{label}</Text>
      </View>
      {hasArrow && <ChevronRight size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  // Appearance & Theme States
  const [appearanceModalVisible, setAppearanceModalVisible] = useState(false);

  // Support Ticket States
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Alerts States
  const [alertsModalVisible, setAlertsModalVisible] = useState(false);
  const [alerts, setAlerts] = useState({
    speedWarning: true,
    lowFuel: true,
    serviceReminder: true,
    bleDisconnect: false,
  });

  // Help State
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // Navigation States
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navSettings, setNavSettings] = useState({
    autoReconnect: true,
    offlineMaps: true,
    audioGuidance: false,
    refreshRate: '500ms',
  });

  // Load persisted settings on start
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedAlerts = await AsyncStorage.getItem('ktm_alerts');
        if (storedAlerts) setAlerts(JSON.parse(storedAlerts));

        const storedNav = await AsyncStorage.getItem('ktm_nav_settings');
        if (storedNav) setNavSettings(JSON.parse(storedNav));
      } catch (e) {
        console.error('[SETTINGS] Error loading stored settings:', e);
      }
    };
    loadSettings();
  }, []);

  const handleSelectTheme = async (themeName) => {
    try {
      await changeTheme(themeName);
      showToast(`Applied ${themeName}!`, 'success');
      setTimeout(() => setAppearanceModalVisible(false), 800);
    } catch (e) {
      showToast('Failed to save theme.', 'error');
    }
  };

  const handleSubmitTicket = async () => {
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      showToast('Please fill in all ticket fields.', 'error');
      return;
    }
    try {
      setSubmittingTicket(true);
      // Simulate API submit request
      setTimeout(() => {
        showToast('Ticket created successfully!', 'success');
        setTicketSubject('');
        setTicketMessage('');
        setSubmittingTicket(false);
      }, 1500);
    } catch (e) {
      showToast('Failed to submit support ticket.', 'error');
      setSubmittingTicket(false);
    }
  };

  const toggleAlert = async (key) => {
    const updated = { ...alerts, [key]: !alerts[key] };
    setAlerts(updated);
    try {
      await AsyncStorage.setItem('ktm_alerts', JSON.stringify(updated));
      showToast('Alert preferences updated!', 'success');
    } catch (e) {
      showToast('Failed to save alert preferences.', 'error');
    }
  };

  const toggleNavSetting = async (key) => {
    const updated = { ...navSettings, [key]: !navSettings[key] };
    setNavSettings(updated);
    try {
      await AsyncStorage.setItem('ktm_nav_settings', JSON.stringify(updated));
      showToast('Navigation preferences updated!', 'success');
    } catch (e) {
      showToast('Failed to save navigation settings.', 'error');
    }
  };

  const changeRefreshRate = async (rate) => {
    const updated = { ...navSettings, refreshRate: rate };
    setNavSettings(updated);
    try {
      await AsyncStorage.setItem('ktm_nav_settings', JSON.stringify(updated));
      showToast(`GPS refresh set to ${rate}!`, 'success');
    } catch (e) {
      showToast('Failed to save refresh rate.', 'error');
    }
  };

  // Password visibility states
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const handleUpdatePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    if (newPassword.length < 4) {
      showToast('Must be at least 4 chars long.', 'error');
      return;
    }

    const email = user?.user?.email || 'swapnilranjan181200@gmail.com';
    
    try {
      setUpdating(true);
      const res = await changePassword(email, oldPassword, newPassword);
      if (res.success) {
        showToast('Password updated successfully!', 'success');
        setTimeout(() => setModalVisible(false), 800);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowOldPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);
      } else {
        showToast(res.error || 'Failed to update.', 'error');
      }
    } catch (err) {
      showToast('Network error occurred.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  // Profile state
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const handleProfilePress = () => {
    setProfileModalVisible(true);
  };

  const handleAppearancePress = () => {
    setAppearanceModalVisible(true);
  };

  const handleNavigationPress = () => {
    setNavModalVisible(true);
  };

  const handleAlertsPress = () => {
    setAlertsModalVisible(true);
  };

  const handleFaqPress = () => {
    setHelpModalVisible(true);
  };

  const handlePremiumPress = () => {
    Alert.alert(
      'KTM Pro Premium', 
      'KTM Premium features include:\n• Live GPX route export\n• Leaderboard lock removals\n• Advanced telemetry dashboard\n\nComing soon in version 1.1.0!'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {toast.visible && (
        <View style={[
          styles.toastContainer, 
          { borderColor: toast.type === 'success' ? Colors.primary : '#FF3B30' }
        ]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContent}>
        <SettingItem icon={User} label="My profile" onPress={handleProfilePress} />
        <SettingItem icon={Key} label="Change password" onPress={() => setModalVisible(true)} />
        <SettingItem icon={Sun} label={`Appearance (${activeTheme})`} onPress={handleAppearancePress} />
        <SettingItem icon={Navigation} label="Navigation" onPress={handleNavigationPress} />
        <SettingItem icon={Bell} label="Alerts" onPress={handleAlertsPress} />
        <SettingItem icon={BarChart3} label="Leaderboard" onPress={() => navigation.navigate('Rankings')} />
        <SettingItem icon={HelpCircle} label="Common Questions" onPress={handleFaqPress} />
        
        <TouchableOpacity 
          style={[styles.settingItem, styles.premiumItem]} 
          activeOpacity={0.8}
          onPress={handlePremiumPress}
        >
           <View style={styles.settingLeft}>
              <Crown size={22} color={Colors.primary} />
              <Text style={[styles.settingLabel, {color: Colors.primary}]}>Premium</Text>
           </View>
           <ChevronRight size={20} color={Colors.primary} />
        </TouchableOpacity>

        <SettingItem icon={LogOut} label="Log out" hasArrow={false} onPress={logout} />

        <View style={styles.versionContainer}>
           <Text style={styles.versionText}>Version: 1.0.0 (Launch)</Text>
           <View style={styles.legalLinks}>
              <Text style={styles.legalText}>Privacy Policy</Text>
              <View style={styles.dot} />
              <Text style={styles.legalText}>Terms of Service</Text>
           </View>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter current password"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry={!showOldPassword}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)} style={styles.eyeButton}>
                {showOldPassword ? <EyeOff size={20} color={Colors.textSecondary} /> : <Eye size={20} color={Colors.textSecondary} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter new password"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeButton}>
                {showNewPassword ? <EyeOff size={20} color={Colors.textSecondary} /> : <Eye size={20} color={Colors.textSecondary} />}
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm new password"
                placeholderTextColor={Colors.textSecondary}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                {showConfirmPassword ? <EyeOff size={20} color={Colors.textSecondary} /> : <Eye size={20} color={Colors.textSecondary} />}
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setOldPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={updating}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.updateButton]}
                onPress={handleUpdatePassword}
                disabled={updating}
              >
                <Text style={styles.updateButtonText}>
                  {updating ? 'Saving...' : 'Update'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Rider Profile Card Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            {/* KTM Accent Header */}
            <View style={styles.profileHeaderAccent}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {user?.user?.name ? user.user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'KT'}
                </Text>
              </View>
            </View>

            <View style={styles.profileDetailsContent}>
              <Text style={styles.profileName}>{user?.user?.name || 'KTM Rider'}</Text>
              <View style={styles.badgeContainer}>
                <View style={styles.proBadge}>
                  <Text style={styles.proBadgeText}>PRO RIDER</Text>
                </View>
                <View style={styles.readyBadge}>
                  <Text style={styles.readyBadgeText}>READY TO RACE</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.profileRow}>
                <Text style={styles.profileRowLabel}>Email</Text>
                <Text style={styles.profileRowValue}>{user?.user?.email || 'swapnilranjan181200@gmail.com'}</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileRowLabel}>Active Vehicle</Text>
                <Text style={styles.profileRowValue}>{user?.user?.bikeModel || 'KTM 250 Duke'}</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileRowLabel}>Rider ID</Text>
                <Text style={styles.profileRowValue} numberOfLines={1}>{user?.user?.id || '6a11801b73eb27e6958867c6'}</Text>
              </View>

              <View style={styles.profileRow}>
                <Text style={styles.profileRowLabel}>Account Status</Text>
                <Text style={[styles.profileRowValue, { color: Colors.primary }]}>Active</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.profileCloseButton} 
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.profileCloseButtonText}>Close Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Appearance Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={appearanceModalVisible}
        onRequestClose={() => setAppearanceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            {/* Header Accent */}
            <View style={[styles.profileHeaderAccent, { height: 70 }]}>
              <Text style={[styles.modalTitle, { marginBottom: 0 }]}>Select Theme</Text>
            </View>

            <View style={[styles.profileDetailsContent, { paddingTop: Spacing.md }]}>
              <TouchableOpacity 
                style={[styles.themeRow, activeTheme === 'KTM Dark Mode' && styles.activeThemeRow]}
                onPress={() => handleSelectTheme('KTM Dark Mode')}
              >
                <View style={styles.themeRowLeft}>
                  <View style={[styles.themeColorDot, { backgroundColor: '#FF6600' }]} />
                  <View>
                    <Text style={styles.themeNameText}>KTM Dark Mode</Text>
                    <Text style={styles.themeDescText}>Signature orange on deep carbon</Text>
                  </View>
                </View>
                {activeTheme === 'KTM Dark Mode' && <View style={styles.radioCheck} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.themeRow, activeTheme === 'Husqvarna Blue' && styles.activeThemeRow]}
                onPress={() => handleSelectTheme('Husqvarna Blue')}
              >
                <View style={styles.themeRowLeft}>
                  <View style={[styles.themeColorDot, { backgroundColor: '#00458C' }]} />
                  <View>
                    <Text style={styles.themeNameText}>Husqvarna Blue</Text>
                    <Text style={styles.themeDescText}>Deep blue & neon yellow accents</Text>
                  </View>
                </View>
                {activeTheme === 'Husqvarna Blue' && <View style={styles.radioCheck} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.themeRow, activeTheme === 'GasGas Red' && styles.activeThemeRow]}
                onPress={() => handleSelectTheme('GasGas Red')}
              >
                <View style={styles.themeRowLeft}>
                  <View style={[styles.themeColorDot, { backgroundColor: '#E30613' }]} />
                  <View>
                    <Text style={styles.themeNameText}>GasGas Red</Text>
                    <Text style={styles.themeDescText}>Factory racing bold red profile</Text>
                  </View>
                </View>
                {activeTheme === 'GasGas Red' && <View style={styles.radioCheck} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.themeRow, activeTheme === 'Beast Edition' && styles.activeThemeRow]}
                onPress={() => handleSelectTheme('Beast Edition')}
              >
                <View style={styles.themeRowLeft}>
                  <View style={[styles.themeColorDot, { backgroundColor: '#333333' }]} />
                  <View>
                    <Text style={styles.themeNameText}>Beast Edition</Text>
                    <Text style={styles.themeDescText}>Stealth matte black layout</Text>
                  </View>
                </View>
                {activeTheme === 'Beast Edition' && <View style={styles.radioCheck} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.themeRow, activeTheme === 'Grand Prix White' && styles.activeThemeRow]}
                onPress={() => handleSelectTheme('Grand Prix White')}
              >
                <View style={styles.themeRowLeft}>
                  <View style={[styles.themeColorDot, { backgroundColor: '#E6E6E6' }]} />
                  <View>
                    <Text style={styles.themeNameText}>Grand Prix White</Text>
                    <Text style={styles.themeDescText}>High contrast white for sun glare</Text>
                  </View>
                </View>
                {activeTheme === 'Grand Prix White' && <View style={styles.radioCheck} />}
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.profileCloseButton, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }]} 
                onPress={() => setAppearanceModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Alerts Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={alertsModalVisible}
        onRequestClose={() => setAlertsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            {/* Header Accent */}
            <View style={[styles.profileHeaderAccent, { height: 70 }]}>
              <Text style={[styles.modalTitle, { marginBottom: 0 }]}>Alert Preferences</Text>
            </View>

            <View style={[styles.profileDetailsContent, { paddingTop: Spacing.md }]}>
              <View style={styles.switchRow}>
                <View style={styles.switchRowLeft}>
                  <Text style={styles.switchLabelText}>Speed Warning</Text>
                  <Text style={styles.switchDescText}>Exceeding 120 km/h warning</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                  thumbColor={alerts.speedWarning ? '#FFFFFF' : '#A89F91'}
                  value={alerts.speedWarning}
                  onValueChange={() => toggleAlert('speedWarning')}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchRowLeft}>
                  <Text style={styles.switchLabelText}>Low Fuel Warning</Text>
                  <Text style={styles.switchDescText}>Fuel level under 3 Liters</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                  thumbColor={alerts.lowFuel ? '#FFFFFF' : '#A89F91'}
                  value={alerts.lowFuel}
                  onValueChange={() => toggleAlert('lowFuel')}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchRowLeft}>
                  <Text style={styles.switchLabelText}>Service Reminder</Text>
                  <Text style={styles.switchDescText}>KTM maintenance schedule cycles</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                  thumbColor={alerts.serviceReminder ? '#FFFFFF' : '#A89F91'}
                  value={alerts.serviceReminder}
                  onValueChange={() => toggleAlert('serviceReminder')}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchRowLeft}>
                  <Text style={styles.switchLabelText}>TFT Connectivity</Text>
                  <Text style={styles.switchDescText}>Notify if BLE connection drops</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                  thumbColor={alerts.bleDisconnect ? '#FFFFFF' : '#A89F91'}
                  value={alerts.bleDisconnect}
                  onValueChange={() => toggleAlert('bleDisconnect')}
                />
              </View>

              <TouchableOpacity 
                style={styles.profileCloseButton} 
                onPress={() => setAlertsModalVisible(false)}
              >
                <Text style={styles.profileCloseButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Help / FAQ Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={helpModalVisible}
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            {/* Header Accent */}
            <View style={[styles.profileHeaderAccent, { height: 70 }]}>
              <Text style={[styles.modalTitle, { marginBottom: 0 }]}>Rider Support & FAQs</Text>
            </View>

            <ScrollView contentContainerStyle={[styles.profileDetailsContent, { paddingTop: Spacing.md, width: '100%' }]}>
              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>🏍️ How do I pair with the KTM Duke TFT?</Text>
                <Text style={styles.faqAnswer}>Turn on Bluetooth on your bike TFT panel. In the companion app, go to Garage, tap the bike card, and choose "Connect BLE".</Text>
              </View>

              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>🗺️ Does navigation work offline?</Text>
                <Text style={styles.faqAnswer}>Yes. Map data caching and offline turn-by-turn routing allow full offline navigation capabilities.</Text>
              </View>

              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>🏆 How is my rank computed?</Text>
                <Text style={styles.faqAnswer}>Rank is computed based on your total recorded ride distances, duration, and top speeds across synced sessions.</Text>
              </View>

              <View style={styles.faqCard}>
                <Text style={styles.faqQuestion}>🛠️ What features does Premium unlock?</Text>
                <Text style={styles.faqAnswer}>Premium unlocks live GPX exports, advanced bike diagnostic telemetry, and removes leaderboard rank locks.</Text>
              </View>

              <View style={styles.divider} />
              
              <Text style={[styles.modalTitle, { fontSize: 18, alignSelf: 'flex-start', marginTop: Spacing.sm }]}>
                🎟️ Create Support Ticket
              </Text>
              
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.ticketInput}
                placeholder="Brief issue summary"
                placeholderTextColor={colors.textSecondary}
                value={ticketSubject}
                onChangeText={setTicketSubject}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.ticketInput, { height: 100, textAlignVertical: 'top' }]}
                placeholder="Tell us what happened with your Duke..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                value={ticketMessage}
                onChangeText={setTicketMessage}
              />

              <TouchableOpacity 
                style={[styles.profileCloseButton, { backgroundColor: colors.primary, marginTop: Spacing.xs }]} 
                onPress={handleSubmitTicket}
                disabled={submittingTicket}
              >
                <Text style={styles.profileCloseButtonText}>
                  {submittingTicket ? 'Submitting...' : 'Submit Support Ticket'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.profileCloseButton, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginTop: Spacing.sm }]} 
                onPress={() => setHelpModalVisible(false)}
              >
                <Text style={[styles.profileCloseButtonText, { color: colors.text }]}>Close Support</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Navigation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={navModalVisible}
        onRequestClose={() => setNavModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.profileModalContent}>
            {/* Header Accent */}
            <View style={[styles.profileHeaderAccent, { height: 70 }]}>
              <Text style={[styles.modalTitle, { marginBottom: 0 }]}>TFT Navigation Config</Text>
            </View>

            <View style={[styles.profileDetailsContent, { paddingTop: Spacing.md }]}>
              <View style={styles.switchRow}>
                <View style={styles.switchRowLeft}>
                  <Text style={styles.switchLabelText}>Auto-Reconnect</Text>
                  <Text style={styles.switchDescText}>Reconnect BLE on ignition</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                  thumbColor={navSettings.autoReconnect ? '#FFFFFF' : '#A89F91'}
                  value={navSettings.autoReconnect}
                  onValueChange={() => toggleNavSetting('autoReconnect')}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchRowLeft}>
                  <Text style={styles.switchLabelText}>Offline Map Cache</Text>
                  <Text style={styles.switchDescText}>Download routes locally</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                  thumbColor={navSettings.offlineMaps ? '#FFFFFF' : '#A89F91'}
                  value={navSettings.offlineMaps}
                  onValueChange={() => toggleNavSetting('offlineMaps')}
                />
              </View>

              <View style={styles.switchRow}>
                <View style={styles.switchRowLeft}>
                  <Text style={styles.switchLabelText}>Audio Guidance</Text>
                  <Text style={styles.switchDescText}>Helmet intercom voice alerts</Text>
                </View>
                <Switch
                  trackColor={{ false: '#3E3E3E', true: Colors.primary }}
                  thumbColor={navSettings.audioGuidance ? '#FFFFFF' : '#A89F91'}
                  value={navSettings.audioGuidance}
                  onValueChange={() => toggleNavSetting('audioGuidance')}
                />
              </View>

              {/* Refresh Rate Segmented Selector */}
              <View style={{ width: '100%', marginTop: Spacing.md, marginBottom: Spacing.sm }}>
                <Text style={styles.switchLabelText}>GPS Refresh Rate</Text>
                <View style={styles.segmentedContainer}>
                  {['500ms', '1s', '2s'].map((rate) => (
                    <TouchableOpacity
                      key={rate}
                      style={[
                        styles.segmentedButton,
                        navSettings.refreshRate === rate && styles.activeSegmentedButton,
                      ]}
                      onPress={() => changeRefreshRate(rate)}
                    >
                      <Text
                        style={[
                          styles.segmentedButtonText,
                          navSettings.refreshRate === rate && styles.activeSegmentedButtonText,
                        ]}
                      >
                        {rate}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity 
                style={styles.profileCloseButton} 
                onPress={() => setNavModalVisible(false)}
              >
                <Text style={styles.profileCloseButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const getStyles = (Colors) => StyleSheet.create({
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
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    color: Colors.text,
    fontSize: 16,
    marginLeft: Spacing.md,
  },
  premiumItem: {
    borderBottomWidth: 0,
    marginTop: Spacing.sm,
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  versionContainer: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  versionText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  legalText: {
    color: Colors.primary,
    fontSize: 12,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.textSecondary,
    marginHorizontal: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  inputLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: Spacing.sm,
    marginBottom: 4,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  passwordInput: {
    flex: 1,
    height: 44,
    color: Colors.text,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.md,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    marginLeft: Spacing.sm,
  },
  cancelButton: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  updateButton: {
    backgroundColor: Colors.primary,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    right: Spacing.lg,
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderRadius: 8,
    padding: Spacing.md,
    zIndex: 999,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileModalContent: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileHeaderAccent: {
    backgroundColor: Colors.primary,
    height: 90,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  profileTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  profileDetailsContent: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surface,
    borderColor: Colors.primary,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: 'bold',
  },
  profileName: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: Spacing.sm,
  },
  readyBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: Spacing.xs,
  },
  readyBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'black',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: '100%',
    marginVertical: Spacing.md,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: Spacing.xs,
  },
  profileRowLabel: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  profileRowValue: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileCloseButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  profileCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activeThemeRow: {
    backgroundColor: 'rgba(255, 102, 0, 0.05)',
  },
  themeRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeColorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: Spacing.md,
  },
  themeNameText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  themeDescText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  radioCheck: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  switchRowLeft: {
    flex: 1,
  },
  switchLabelText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchDescText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  faqCard: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: Spacing.sm,
  },
  faqQuestion: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  faqAnswer: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 8,
    padding: 3,
    width: '100%',
  },
  segmentedButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeSegmentedButton: {
    backgroundColor: Colors.primary,
  },
  segmentedButtonText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  activeSegmentedButtonText: {
    color: Colors.text,
  },
  ticketInput: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    color: Colors.text,
    fontSize: 14,
    width: '100%',
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
});

export default SettingsScreen;

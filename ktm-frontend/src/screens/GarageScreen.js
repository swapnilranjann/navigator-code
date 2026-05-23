import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../theme/colors';
import { ThemeContext } from '../context/ThemeContext';
import BikeCard from '../components/BikeCard';
import LoadingScreen from '../components/LoadingScreen';
import { Bell, Settings, Navigation2, ChevronDown } from 'lucide-react-native';
import { fetchBikeDetails } from '../utils/Api';

const GarageScreen = ({ navigation }) => {
  const { colors } = React.useContext(ThemeContext);
  const styles = getStyles(colors);

  const [bike, setBike] = React.useState({
    name: 'dukie',
    model: 'KTM 250 Duke • 2025',
    status: 'Connecting...',
    lastActive: 'Just now'
  });

  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleBikePress = () => {
    Alert.alert(
      'KTM BLE Connection',
      `Vehicle: ${bike.name}\nModel: ${bike.model}\nStatus: ${bike.status}\n\nDo you want to search and re-pair with this bike's TFT display?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Connect BLE', 
          onPress: () => {
            Alert.alert('BLE Pairing', 'Scanning for KTM Duke TFT Display... Make sure Bluetooth is enabled on your motorcycle.');
          }
        }
      ]
    );
  };

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchBikeDetails();
        if (data) setBike(data);
      } catch (err) {
        console.error('[GARAGE] Error loading bike details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingScreen message="CONNECTING TO BIKE..." />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bikes</Text>
        <TouchableOpacity 
          style={styles.helpButton}
          onPress={() => Alert.alert('KTM Companion Help', 'Pair your KTM Duke 250 with your mobile phone via BLE (Bluetooth Low Energy) to mirror turn-by-turn navigation arrows directly onto the motorcycle\'s TFT dash.')}
        >
           <Text style={styles.helpText}>Help ?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Promotion/What's New Card */}
        <TouchableOpacity style={styles.promoCard} activeOpacity={0.9} onPress={() => setModalVisible(true)}>
          <View style={styles.promoIconContainer}>
            <Text style={styles.newTag}>NEW</Text>
          </View>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>What's New</Text>
            <Text style={styles.promoSubtitle}>New onboarding, re-pair bike, and more</Text>
            <TouchableOpacity style={styles.seeChanges} onPress={() => setModalVisible(true)}>
               <Text style={styles.seeChangesText}>See Changes</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
           <View style={[styles.dot, styles.activeDot]} />
           {[...Array(9)].map((_, i) => <View key={i} style={styles.dot} />)}
        </View>

        {/* Your Bike */}
        <BikeCard 
          name={bike.name} 
          model={bike.model} 
          status={bike.status} 
          lastActive={bike.lastActive}
          imageUri={require('../assets/ktm_bike.png')}
          onPress={handleBikePress}
        />

        {/* Navigation Notification Section */}
        <TouchableOpacity 
          style={styles.navNotification} 
          activeOpacity={0.8}
          onPress={() => Alert.alert('Navigation Alert', 'No active trip details detected. Start navigation to send turn-by-turn instructions to your KTM screen.')}
        >
           <Text style={styles.navNotifText}>Detected Navigation Notification</Text>
           <ChevronDown size={20} color={Colors.text} />
        </TouchableOpacity>

      </ScrollView>



      {/* What's New Release Notes Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>KTM Companion v1.0.0</Text>
            <Text style={styles.modalSubtitle}>Ready to Race Launch Features 🚀</Text>
            
            <ScrollView style={styles.featuresList} showsVerticalScrollIndicator={false}>
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>🔥</Text>
                <View style={styles.featureTextWrapper}>
                  <Text style={styles.featureName}>Restructured Layout</Text>
                  <Text style={styles.featureDesc}>Clean, independent frontend & backend workspaces.</Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>🛡️</Text>
                <View style={styles.featureTextWrapper}>
                  <Text style={styles.featureName}>Secure Authentication</Text>
                  <Text style={styles.featureDesc}>JWT authorization with password encryption and quick registration.</Text>
                </View>
              </View>
              
              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>📊</Text>
                <View style={styles.featureTextWrapper}>
                  <Text style={styles.featureName}>Console Observers</Text>
                  <Text style={styles.featureDesc}>Visually styled request & response boxes for local terminal debugging.</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>🌐</Text>
                <View style={styles.featureTextWrapper}>
                  <Text style={styles.featureName}>Robust Network Engine</Text>
                  <Text style={styles.featureDesc}>Hermes-compatible AbortController request timeout logic.</Text>
                </View>
              </View>

              <View style={styles.featureItem}>
                <Text style={styles.featureBullet}>🏍️</Text>
                <View style={styles.featureTextWrapper}>
                  <Text style={styles.featureName}>TFT Navigation Link</Text>
                  <Text style={styles.featureDesc}>BLE Bluetooth packet utilities to pair Duke 250 display.</Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>READY TO RACE</Text>
            </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  helpButton: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  helpText: {
    color: Colors.text,
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  promoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  promoIconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#3E4B5E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  newTag: {
    color: '#90CAF9',
    fontWeight: 'bold',
    fontSize: 12,
  },
  promoTextContainer: {
    flex: 1,
  },
  promoTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  promoSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  seeChanges: {
    marginTop: Spacing.sm,
  },
  seeChangesText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 18,
    backgroundColor: Colors.primary,
  },
  navNotification: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  navNotifText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderRadius: 28,
    width: '100%',
    maxHeight: '80%',
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalSubtitle: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  featuresList: {
    width: '100%',
    marginVertical: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
    width: '100%',
  },
  featureBullet: {
    fontSize: 20,
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  featureTextWrapper: {
    flex: 1,
  },
  featureName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  featureDesc: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    width: '100%',
    borderRadius: 15,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  closeButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});

export default GarageScreen;

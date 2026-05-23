import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../theme/colors';
import BikeCard from '../components/BikeCard';
import LoadingScreen from '../components/LoadingScreen';
import { Bell, Settings, Navigation2, ChevronDown } from 'lucide-react-native';
import { fetchBikeDetails } from '../utils/Api';

const GarageScreen = () => {
  const [bike, setBike] = React.useState({
    name: 'dukie',
    model: 'KTM 250 Duke • 2025',
    status: 'Connecting...',
    lastActive: 'Just now'
  });

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchBikeDetails();
      if (data) setBike(data);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) return <LoadingScreen message="CONNECTING TO BIKE..." />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bikes</Text>
        <TouchableOpacity style={styles.helpButton}>
           <Text style={styles.helpText}>Help ?</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Promotion/What's New Card */}
        <TouchableOpacity style={styles.promoCard} activeOpacity={0.9}>
          <View style={styles.promoIconContainer}>
            <Text style={styles.newTag}>NEW</Text>
          </View>
          <View style={styles.promoTextContainer}>
            <Text style={styles.promoTitle}>What's New</Text>
            <Text style={styles.promoSubtitle}>New onboarding, re-pair bike, and more</Text>
            <TouchableOpacity style={styles.seeChanges}>
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
        />

        {/* Navigation Notification Section */}
        <TouchableOpacity style={styles.navNotification} activeOpacity={0.8}>
           <Text style={styles.navNotifText}>Detected Navigation Notification</Text>
           <ChevronDown size={20} color={Colors.text} />
        </TouchableOpacity>

      </ScrollView>

      {/* Footer Navigation Placeholder (Simulated) */}
      <View style={styles.bottomNav}>
         <View style={styles.navItem}>
            <Navigation2 size={24} color={Colors.primary} />
            <Text style={[styles.navLabel, {color: Colors.primary}]}>Garage</Text>
         </View>
         <View style={styles.navItem}>
            <Settings size={24} color={Colors.textSecondary} />
            <Text style={styles.navLabel}>My Rides</Text>
         </View>
      </View>
    </SafeAreaView>
  );
};

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
});

export default GarageScreen;

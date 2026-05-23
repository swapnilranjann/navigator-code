import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../theme/colors';
import { ChevronLeft, MoreVertical, MapPin, Navigation } from 'lucide-react-native';

import { fetchRides } from '../utils/Api';
import LoadingScreen from '../components/LoadingScreen';

const RidesScreen = () => {
  const [rides, setRides] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeDate, setActiveDate] = React.useState(15);
  const days = [
    { day: 'Mon', date: 18 }, { day: 'Sun', date: 17 }, { day: 'Sat', date: 16 },
    { day: 'Fri', date: 15 }, { day: 'Thu', date: 14 },
    { day: 'Wed', date: 13 }, { day: 'Tue', date: 12 },
  ];

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchRides();
        if (data) setRides(data);
      } catch (err) {
        console.error('[RIDES] Error loading rides:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingScreen message="SYNCING RIDE DATA..." />;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
           <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Ride history</Text>
          <Text style={styles.headerSubtitle}>dukie</Text>
        </View>
        <TouchableOpacity>
           <MoreVertical size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <View style={styles.tabItem}>
           <Text style={styles.activeTabText}>Details</Text>
           <View style={styles.activeIndicator} />
        </View>
        <View style={styles.tabItem}>
           <Text style={styles.inactiveTabText}>Summary</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Month Selector */}
        <View style={styles.monthHeader}>
           <View style={styles.monthLabel}>
              <ChevronLeft size={20} color={Colors.primary} />
              <Text style={styles.monthText}>May 2026</Text>
           </View>
           <View style={styles.rideCount}>
              <Text style={styles.rideCountText}>{rides.length} rides</Text>
           </View>
        </View>

        {/* Calendar Bar */}
        <View style={styles.calendar}>
           {days.map((item, idx) => {
             const isDayActive = item.date === activeDate;
             return (
               <TouchableOpacity 
                 key={idx} 
                 style={styles.calendarDay}
                 onPress={() => setActiveDate(item.date)}
                 activeOpacity={0.7}
               >
                  <Text style={[styles.calDayText, isDayActive && styles.calActiveDayText]}>{item.day}</Text>
                  <Text style={[styles.calDateText, isDayActive && styles.calActiveDateText]}>{item.date}</Text>
               </TouchableOpacity>
             );
           })}
        </View>

        {/* Ride Cards */}
        {rides.map((ride, idx) => (
          <View key={idx} style={styles.rideCard}>
            <Image source={require('../assets/ride_map.png')} style={styles.rideMap} />
            <View style={styles.mapOverlay}>
                <View style={styles.statChip}>
                  <Navigation size={12} color={Colors.text} />
                  <Text style={styles.statChipText}>{ride.distance} km</Text>
                </View>
                <View style={styles.statChip}>
                  <Text style={styles.statChipText}>{ride.duration}</Text>
                </View>
                <View style={styles.statChip}>
                  <Text style={styles.statChipText}>{ride.avgSpeed} km/h</Text>
                </View>
            </View>

            <View style={styles.rideDetails}>
                <Text style={styles.rideTitle}>{ride.date} • {ride.startTime} - {ride.endTime}</Text>
                
                <View style={styles.locationRow}>
                  <MapPin size={14} color={Colors.primary} />
                  <Text style={styles.locationText} numberOfLines={1}>
                      From: {ride.from}
                  </Text>
                </View>
                
                <View style={styles.locationRow}>
                  <MapPin size={14} color={Colors.textSecondary} />
                  <Text style={styles.locationText} numberOfLines={1}>
                      To: {ride.to}
                  </Text>
                </View>
            </View>
          </View>
        ))}

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  inactiveTabText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '40%',
    height: 3,
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  monthLabel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: Spacing.xs,
  },
  rideCount: {
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  rideCountText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  calendar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  calendarDay: {
    alignItems: 'center',
  },
  calDayText: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  calActiveDayText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  calDateText: {
    color: Colors.textSecondary,
    fontSize: 18,
  },
  calActiveDateText: {
    color: Colors.primary,
    fontSize: 24,
    fontWeight: 'bold',
  },
  rideCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  rideMap: {
    width: '100%',
    height: 180,
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    justifyContent: 'space-between',
  },
  statChip: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statChipText: {
    color: Colors.text,
    fontSize: 12,
    marginLeft: 4,
  },
  rideDetails: {
    padding: Spacing.md,
  },
  rideTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginLeft: Spacing.xs,
    flex: 1,
  }
});

export default RidesScreen;

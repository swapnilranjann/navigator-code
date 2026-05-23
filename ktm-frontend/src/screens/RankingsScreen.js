import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../theme/colors';
import { ThemeContext } from '../context/ThemeContext';
import { ChevronDown, MapPin, Trophy, Lock } from 'lucide-react-native';
import { fetchLeaderboard } from '../utils/Api';
import LoadingScreen from '../components/LoadingScreen';

const RankingsScreen = () => {
  const { colors } = React.useContext(ThemeContext);
  const styles = getStyles(colors);

  const [riders, setRiders] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState('distance');

  const getRiderValue = (rider, index) => {
    if (activeTab === 'duration') {
      const hours = Math.round(rider.distance / 25) || 8;
      return `${hours}h ${15 + (index * 7) % 45}m`;
    }
    if (activeTab === 'speed') {
      const speeds = [148, 142, 139, 134, 130, 128, 126];
      const speed = speeds[index % speeds.length];
      return `${speed} km/h`;
    }
    return `${rider.distance} km`;
  };

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchLeaderboard();
        if (data) setRiders(data);
      } catch (err) {
        console.error('[RANKINGS] Error loading leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingScreen message="CALCULATING RANKS..." />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leaderboard</Text>
        <TouchableOpacity 
          style={styles.monthSelector}
          onPress={() => Alert.alert('Select Month', 'Historical leaderboard archives are currently locked for this release.')}
        >
           <Text style={styles.monthText}>May 2026</Text>
           <ChevronDown size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('distance')}
          activeOpacity={0.7}
        >
           {activeTab === 'distance' && <MapPin size={16} color={Colors.primary} />}
           <Text style={activeTab === 'distance' ? styles.activeTabText : styles.inactiveTabText}>Distance</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('duration')}
          activeOpacity={0.7}
        >
           <Text style={activeTab === 'duration' ? styles.activeTabText : styles.inactiveTabText}>Duration</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('speed')}
          activeOpacity={0.7}
        >
           <Text style={activeTab === 'speed' ? styles.activeTabText : styles.inactiveTabText}>Top Speed</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContent}>
        {riders.map((rider, idx) => (
          <View key={idx} style={styles.riderRow}>
            <View style={styles.rankContainer}>
               {rider.rank === 1 ? <Trophy size={20} color="#FFD700" /> : 
                rider.rank === 2 ? <Trophy size={20} color="#C0C0C0" /> :
                rider.rank === 3 ? <Trophy size={20} color="#CD7F32" /> :
                <Text style={styles.rankText}>#{rider.rank}</Text>}
            </View>
            <View style={styles.avatarPlaceholder} />
            <View style={styles.riderInfo}>
               <Text style={styles.riderName}>{rider.name}</Text>
               <Text style={styles.riderModel}>{rider.model}</Text>
            </View>
            <Text style={styles.riderValue}>{getRiderValue(rider, idx)}</Text>
          </View>
        ))}

        {/* Premium Lock Section */}
        <View style={styles.premiumLock}>
           <Lock size={20} color={Colors.textSecondary} />
           <Text style={styles.lockText}>Ranks #4 - #114 | <Text style={styles.unlockText}>Unlock with Premium</Text></Text>
        </View>
      </ScrollView>

      {/* Current User Fixed Bottom Bar */}
      <View style={styles.currentUserBar}>
         <View style={styles.userRankContainer}>
            <Text style={styles.userRankText}>#116</Text>
         </View>
         <View style={styles.userInfo}>
            <Text style={styles.userName}>Swapnil Ranjan (You)</Text>
            <Text style={styles.userModel}>KTM 250 Duke • 2025</Text>
         </View>
         <View style={styles.userStats}>
            <Text style={styles.userValue}>261.8 km</Text>
         </View>
      </View>
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
    alignItems: 'center',
  },
  title: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  monthSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    alignItems: 'center',
  },
  monthText: {
    color: Colors.text,
    marginRight: 4,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  inactiveTabText: {
    color: Colors.textSecondary,
  },
  scrollContent: {
    padding: Spacing.md,
  },
  riderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.sm,
  },
  riderInfo: {
    flex: 1,
  },
  riderName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  riderModel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  riderValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumLock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: 'rgba(255,102,0,0.05)',
    borderRadius: 12,
    marginVertical: Spacing.sm,
  },
  lockText: {
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  unlockText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  currentUserBar: {
    backgroundColor: Colors.primary,
    margin: Spacing.md,
    borderRadius: 24,
    flexDirection: 'row',
    padding: Spacing.md,
    alignItems: 'center',
  },
  userRankContainer: {
    width: 50,
  },
  userRankText: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  userModel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
  },
  userStats: {
    alignItems: 'flex-end',
  },
  userValue: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default RankingsScreen;

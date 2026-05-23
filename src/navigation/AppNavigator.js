import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Bike, History, Trophy, Settings as SettingsIcon } from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { AuthContext } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

// Screens
import GarageScreen from '../screens/GarageScreen';
import RidesScreen from '../screens/RidesScreen';
import RankingsScreen from '../screens/RankingsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.surface,
        borderTopColor: Colors.border,
        height: 70,
        paddingBottom: 10,
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      tabBarIcon: ({ color, size }) => {
        if (route.name === 'Garage') return <Bike color={color} size={size} />;
        if (route.name === 'My Rides') return <History color={color} size={size} />;
        if (route.name === 'Rankings') return <Trophy color={color} size={size} />;
        if (route.name === 'Settings') return <SettingsIcon color={color} size={size} />;
      },
    })}
  >
    <Tab.Screen name="Garage" component={GarageScreen} />
    <Tab.Screen name="My Rides" component={RidesScreen} />
    <Tab.Screen name="Rankings" component={RankingsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <LoadingScreen message="WARMING UP ENGINE..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;

import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';

import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';


const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      animation: 'fade',
      headerShown: false,
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: 'home',
          Calendar: 'calendar',
          Profile: 'person',
          Notifications: 'notifications',
          Settings: 'settings',
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#0074',
      tabBarInactiveTintColor: '#007AFF',
      tabBarStyle: { position: 'absolute' },
    tabBarBackground: () => (
      <BlurView tint="light" intensity={100} style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, backgroundColor: 'transparent', brightness: 0.1 }} />
    ),
    })}
    
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Calendar' component={CalendarScreen} />
        <Tab.Screen name='Profile' component={ProfileScreen} />
        <Tab.Screen name='Notifications' component={NotificationScreen} options={{
          tabBarBadge: 3,
        }} />
        <Tab.Screen name='Settings' component={SettingScreen} />

      </Tab.Navigator>
  );
}

export default TabNavigator;
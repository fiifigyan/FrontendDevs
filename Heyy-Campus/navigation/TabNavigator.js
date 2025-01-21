import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/tabs/HomeScreen';
import CalendarScreen from '../screens/tabs/CalendarScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import NotificationScreen from '../screens/tabs/NotificationScreen';
import SettingScreen from '../screens/tabs/SettingScreen';


const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
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
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: '#fff',
      },
    })}
    
      >
        <Tab.Screen name='Home' component={HomeScreen} />
        <Tab.Screen name='Calendar' component={CalendarScreen} />
        <Tab.Screen name='Profile' component={ProfileScreen} />
        <Tab.Screen name='Notifications' component={NotificationScreen} />
        <Tab.Screen name='Settings' component={SettingScreen} />

      </Tab.Navigator>
  );
}

export default TabNavigator;
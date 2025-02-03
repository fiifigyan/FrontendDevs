// StackNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';

// Screens
import AdmissionForm from '../screens/AdmissionForm';
import HomeScreen from '../screens/HomeScreen';
import AddAccountScreen from '../screens/AddAccountScreen';
import SwitchAccountScreen from '../screens/SwitchAccountScreen';
import MakePaymentScreen from '../screens/MakePaymentScreen';
import PaymentHistoryScreen from '../screens/PaymentHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CalendarScreen from '../screens/CalendarScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import EventScreen from '../screens/EventScreen';
import EditProfile from '../screens/EditProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import TabNavigator from './TabNavigator';

// Components
import CustomDrawer from '../components/CustomDrawer';
import CustomHeader from '../components/CustomHeader';
// import HomeScreen from '../screens/HomeScreen';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        header: () => <CustomHeader />,
        drawerStyle: { width: 300 },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#000',
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="home-outline" size={20} color={focused ? '#007AFF' : '#000'} />
          ),
        }}
      />
      <Drawer.Screen
        name="Admission"
        component={AdmissionForm}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="book-outline" size={20} color={focused ? '#007AFF' : '#000'} />
          ),
        }}
      />
      <Drawer.Screen
        name="Help"
        component={HelpCenterScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="help-circle-outline" size={20} color={focused ? '#007AFF' : '#000'} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment"
        component={PaymentHistoryScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="cash-outline" size={20} color={focused ? '#007AFF' : '#000'} />
          ),
        }}
      />
      <Drawer.Screen
        name="Switch Account"
        component={HelpCenterScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="help-circle-outline" size={20} color={focused ? '#007AFF' : '#000'} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="Admission" component={AdmissionForm} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} />
      <Stack.Screen name="SwitchAccount" component={SwitchAccountScreen} />
      <Stack.Screen name="MakePayment" component={MakePaymentScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
      <Stack.Screen name="Events" component={EventScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigator;
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import AdmissionForm from '../screens/AdmissionForm';
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
import TabNavigator from './TabNavigator';

// Components
import CustomDrawer from '../components/CustomDrawer';

// Create the navigators
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator Component
export const StackNavigator = () => {
  return (
    <Stack.Navigator
    initialRouteName="Welcome"
    screenOptions={{
      headerStyle: {
        backgroundColor: '#0074FF',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='EditProfile'
        component={EditProfile}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Home'
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Calendar'
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Notifications'
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Settings'
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Admission'
        component={AdmissionForm}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='AddAccount'
        component={AddAccountScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='SwitchAccount'
        component={SwitchAccountScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='MakePayment'
        component={MakePaymentScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='PaymentHistory'
        component={PaymentHistoryScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name='Events'
        component={EventScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

// Main Drawer Navigator
export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        backgroundColor: '#0074FF',
        drawerStyle: {
          width: 300,
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#000',
        drawerLabelStyle: {
          fontSize: 16,
        },
      }} 
    >
      <Drawer.Screen
        name="Home"
        component={StackNavigator}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="home-outline" size={20} color={focused ? '#007AFF' : '#000'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Adission"
        component={AdmissionForm}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="document-outline" size={20} color={focused ? '#007AFF' : '#000'} />
          ),
        }}
      />
      <Drawer.Screen
        name="AddAccount"
        component={AddAccountScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="add-account-outline" size={20} color={focused ? '#007AFF' : '#000'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="SwitchAccount"
        component={SwitchAccountScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="switch-account-outline" size={20} color={focused ? '#007AFF' : '#000'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="MakePayment"
        component={MakePaymentScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="card-outline" size={20} color={focused ? '#007AFF' : '#000'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="PaymentHistory"
        component={PaymentHistoryScreen}
        options={{
          drawerIcon: ({ focused }) => (
            <Icon name="history-outline" size={20} color={focused ? '#007AFF' : '#000'}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default StackNavigator;
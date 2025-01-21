import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';

// Screens
import AdmissionForm from '../screens/tabs/AdmissionForm';
import AddAccountScreen from '../screens/tabs/AddAccountScreen';
import SwitchAccountScreen from '../screens/tabs/SwitchAccountScreen';
import MakePaymentScreen from '../screens/tabs/MakePaymentScreen';
import PaymentHistoryScreen from '../screens/tabs/PaymentHistoryScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import CalendarScreen from '../screens/tabs/CalendarScreen';
import NotificationScreen from '../screens/tabs/NotificationScreen';
import SettingScreen from '../screens/tabs/SettingScreen';
import EventScreen from '../screens/tabs/EventScreen';
import HelpCenterScreen from '../screens/tabs/HelpCenterScreen';
import EditProfileScreen from '../screens/tabs/EditProfileScreen';
import HomeScreen from '../screens/tabs/HomeScreen';
import TabNavigator from './TabNavigator';

// Components
import CustomHeader from '../components/CustomHeader';
import CustomDrawer from '../components/CustomDrawer';
import SuccessScreen from '../screens/tabs/SuccessScreen';


// Create the navigators
const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator Component
export const StackNavigator = () => {
  return (
    <Stack.Navigator
    initialRouteName="Home"
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
        name='Home'
        component={HomeScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Home"
              onMenuPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name='Calendar'
        component={CalendarScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Calendar"
              onMenuPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Profile"
              onMenuPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name='Notifications'
        component={NotificationScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Notifications"
              onMenuPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
      <Stack.Screen
        name='Settings'
        component={SettingScreen}
        options={({ navigation }) => ({
          header: () => (
            <CustomHeader
              title="Settings"
              onMenuPress={() => navigation.openDrawer()}
            />
          ),
        })}
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
      <Stack.Screen 
        name="SuccessScreen" 
        component={SuccessScreen}
        options={{ headerShown: false }}
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
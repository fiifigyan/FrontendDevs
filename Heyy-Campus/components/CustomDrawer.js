import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text, Image, TouchableOpacity } from 'react-native';
import {config} from '../config';
import { AuthContext } from '../context/AuthContext';

const CustomDrawer = (props) => {
  const navigation = useNavigation();
  const {userInfo, logout} = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.appName}>{config.APP_NAME}</Text>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={userInfo?.profileImageUrl || require('../assets/images/fiifi1.jpg')}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>{userInfo?.fname + ' ' + userInfo?.lname || 'John Doe'}</Text>
            <Text style={styles.userRole}>{userInfo?.role || 'Parent'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="create-outline" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.drawerFooter}>
        <TouchableOpacity 
          style={styles.footerItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="settings-outline" size={20} color="#007AFF" />
          <Text style={styles.footerItemText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.footerItem}
          onPress={() => navigation.navigate('HelpCenter')}
        >
          <Icon name="help-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.footerItemText}>Help Center</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.footerItem}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={20} color="#007AFF" />
          <Text style={styles.footerItemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 10,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: '50%',
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 14,
    color: '#666',
  },
  editProfileButton: {
    marginLeft: 'auto',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    padding: 10,
    gap: 10,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItemText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default CustomDrawer;
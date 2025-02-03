import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation, useDrawerStatus, DrawerActions } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../context/AuthContext';

const CustomHeader = () => {
  const navigation = useNavigation();
  const { userInfo } = useContext(AuthContext);
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => { 
          navigation.dispatch(DrawerActions.openDrawer());
      }}>
      <Image 
        source={userInfo?.profileImageUrl ? { uri: userInfo.profileImageUrl } : require('../assets/images/fiifi1.jpg')} 
        style={styles.profileImage}
      />

      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
        <Icon name="notifications" size={25} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007bff',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    borderWidth: 1, 
    borderColor: '#fff'
  }
});

export default CustomHeader;
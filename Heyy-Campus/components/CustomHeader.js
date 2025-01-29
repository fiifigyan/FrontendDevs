import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const CustomHeader = ({ title, onMenuPress }) => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.header}>
      <TouchableOpacity onMenuPress={() => navigation.openDrawer()}>
        <Image 
          source={require('../assets/icon.png')} 
          style={{ width: 50, height: 50, borderRadius: '50%', borderWidth: 1, borderColor: '#fff' }} 
        />
        <Text style={styles.headerText}>Welcome to Heyy Campus</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Notifications')} >
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
});

export default CustomHeader;

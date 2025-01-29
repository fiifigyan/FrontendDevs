import React, { useEffect, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = () => {
  const navigation = useNavigation();

  // Access user info and other context values from AuthContext
  const { userInfo } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: userInfo?.profileImageUrl || '',
                cache: 'reload',
              }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.profileName}>{userInfo?.name || 'Welcome!'} </Text>
              <Text style={styles.profileDetails}> Relationship: {userInfo?.relationship || 'N/A'} </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="create-outline" size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Academics Section */}
        <View style={styles.academicsCard}>
          <Text style={styles.sectionTitle}>Academics</Text>
          <View style={styles.academicOptions}>
            {[
              { title: 'Schedule', icon: 'time-outline', route: 'Schedule' },
              { title: 'Attendance', icon: 'calendar-outline', route: 'Attendance' },
              { title: 'Fees', icon: 'cash-outline', route: 'Fees' },
              { title: 'Home Work', icon: 'book-outline', route: 'HomeWork' }
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.academicItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <Icon name={item.icon} size={22} color="#007AFF" />
                <Text style={styles.academicItemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Live Tracking Section */}
        <View style={styles.updateCard}>
          <Text style={styles.sectionTitle}>Live Tracking</Text>
          <View style={styles.updateItem}>
            <Text style={styles.updateText}>Track your child's school bus in real-time.</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LiveTracking')}>
              <Text style={styles.trackNow}>Track Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.updateCard}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          {userInfo?.notifications?.length > 0 ? (
            userInfo.notifications.map((notification, index) => (
              <View key={index} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notification}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.notificationText}>No new notifications</Text>
          )}
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.eventsCard}>
          <View style={styles.eventsCardHeader}>
            <Text style={styles.eventsCardTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Events')}>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.eventImagesContainer}>
            <Image source={require('../assets/images/Altos-Odyssey.jpeg')} style={styles.eventImage} />
            <Image source={require('../assets/images/battlefield-2042.webp')} style={styles.eventImage} />
            <Image source={require('../assets/images/asphalt-9.jpeg')} style={styles.eventImage} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const shadowStyle = {
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
    // padding: 15,
  },
  content: {
    padding: 15,
  },
  profileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    ...shadowStyle,
    marginVertical: 5
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: '50%',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileDetails: {
    fontSize: 14,
    color: '#777',
  },
  academicsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    ...shadowStyle,
    marginVertical: 5
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  academicOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  academicItem: {
    alignItems: 'center',
  },
  academicItemTitle: {
    fontSize: 14,
    color: '#555',
  },
  updateCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    ...shadowStyle,
  },
  updateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  updateText: {
    fontSize: 14,
    color: '#555',
  },
  trackNow: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  eventsCard: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    ...shadowStyle,
  },
  eventsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  eventsCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  eventImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    resizeMode: 'cover',
  },
});

export default HomeScreen;

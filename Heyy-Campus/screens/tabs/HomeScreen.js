import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AppCarousel from '../../components/AppCarousel';


const HomeScreen = () => {
  const navigation = useNavigation();
  // State for profile data
  const [profile, setProfile] = useState({
    name: '',
    details: '',
    imageUrl: '',
    performance: 0,
  });

  // Simulate fetching user profile data (e.g., from an API)
  useEffect(() => {
    // Replace with your API call
    const fetchProfileData = async () => {
      const fetchedProfile = {
        name: 'Fiifi Gyan',
        details: 'Class XI-B | Roll no: 04',
        imageUrl: '../../assets/images/fiifi1.jpg',
        performance: 80,
      };
      setProfile(fetchedProfile);
    };

    fetchProfileData();
  }, []);

  return (
      <ScrollView style={styles.container}>
        {/* Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={{ uri: profile.imageUrl }}
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileDetails}>{profile.details}</Text>
            </View>
          </View>
          <View style={styles.performanceBar}>
            <Text style={styles.performanceText}>
              Overall Performance: {profile.performance}%
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progress, { width: `${profile.performance}%` }]} />
            </View>
          </View>
        </View>

        {/* Academics Section */}
        <View style={styles.academicsCard}>
          <Text style={styles.sectionTitle}>Academics</Text>
          <View style={styles.academicOptions}>
            <TouchableOpacity style={styles.academicItem} onPress = {() => navigation.navigate('Attendance')} >
              <Icon name="calendar-outline" size={22} color="#007AFF" />
              <Text style={styles.academicItemTitle}>Attendance</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.academicItem} onPress = {() => navigation.navigate('Fees')} >
              <Icon name="cash-outline" size={22} color="#007AFF" />
              <Text style={styles.academicItemTitle}>Fees</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.academicItem} onPress = {() => navigation.navigate('AskDoubt')} >
              <Icon name="chatbubble-ellipses-outline" size={22} color="#007AFF" />
              <Text style={styles.academicItemTitle}>Ask Doubt</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.academicItem} onPress = {() => navigation.navigate('LiveTracking')} >
              <Icon name="map-outline" size={22} color="#007AFF" />
              <Text style={styles.academicItemTitle}>Live Tracking</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Updates Section */}
        <View style={styles.updateCard}>
          <Text style={styles.sectionTitle}>Updates</Text>
          <View style={styles.updateItem}>
            <Text style={styles.updateText}>Live location</Text>
            <TouchableOpacity>
              <Text style={styles.trackNow}>Track Now</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Upcoming Events Section */}
        <View style={styles.eventsContainer}>
          <View style={styles.eventsContainerHeader}>
            <Text style={styles.eventsContainerTitle}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll} onPress = {() => navigation.navigate('Events')}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.carousel}>
            <AppCarousel />
          </View>
        </View>

        {/* Trends Section */}
        <View style={styles.trendWrapper}>

        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f0f0',
    padding: 15,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginVertical: 5
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileDetails: {
    fontSize: 14,
    color: '#777',
  },
  performanceBar: {
    marginTop: 10,
  },
  performanceText: {
    fontSize: 14,
    color: '#555',
  },
  progressBar: {
    height: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginTop: 5,
  },
  progress: {
    height: 5,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  academicsCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  admissionCard: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 20,
    alignItems: 'center',
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  admissionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  updateCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
  eventsContainer: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventsContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  eventsContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  eventsContainerTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  // trendWrapper:{backgroundColor}
});

export default HomeScreen;
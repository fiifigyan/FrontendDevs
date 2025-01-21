import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { navigation } from '@react-navigation/native';

const WelcomeScreen = () => {

  return (
    <ScrollView style={styles.container}>
        {/* Trends */}
      <View style={styles.trendsContainer}>
        <Text style={styles.trendsTitle}>What's Trending?</Text>
        <View style={styles.trends}>
          <Text style={styles.trend}>#Trend1</Text>
          <Text style={styles.trend}>#Trend2</Text>
          <Text style={styles.trend}>#Trend3</Text>
          <Text style={styles.trend}>#Trend4</Text>
          <Text style={styles.trend}>#Trend5</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress = {() => navigation.navigate('AdmissionForm')}>
          <Text style={styles.buttonText}>Admission</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress = {() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    trendsContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    trendsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    trends: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 20,
    },
    trend: {
        fontSize: 16,
        color: '#007AFF',
        marginRight: 10,
        marginBottom: 10,
    },
    buttons: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    button: {
        width: '100%',
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        marginHorizontal: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDisabled: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    opacity: 0.5,
    },
    buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    },
    buttonDisabled: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 10,
    opacity: 0.5,
    },
})
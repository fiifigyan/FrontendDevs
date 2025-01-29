import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Card from '../components/Card';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const { userInfo } = useContext(AuthContext);

    const QuickActionCard = ({ iconName, title, description, onPress }) => (
        <TouchableOpacity onPress={onPress}>
            <Card style={styles.actionCard}>
                <Icon name={iconName} size={24} color="#007AFF" />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{title}</Text>
                    <Text style={styles.cardDescription}>{description}</Text>
                </View>
                <Icon name="chevron-forward" size={20} color="#666" />
            </Card>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>
                    Welcome, {userInfo?.fname|| 'Parent'}!
                </Text>
                <Text style={styles.subtitle}>
                    Let's get started with your child's admission process
                </Text>
            </View>

            {/* Get Started Guide */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                
                <QuickActionCard
                    iconName="person-outline"
                    title="Complete Your Profile"
                    description="Add your contact details and preferences"
                    onPress={() => navigation.navigate('Profile')}
                />

                <QuickActionCard
                    iconName="book-outline"
                    title="Start New Admission"
                    description="Apply for your child's admission"
                    onPress={() => navigation.navigate('Admission')}
                />

                <QuickActionCard
                    iconName="calendar-outline"
                    title="View Admission Calendar"
                    description="Check important dates and deadlines"
                    onPress={() => navigation.navigate('AdmissionCalendar')}
                />

                <QuickActionCard
                    iconName="document-text-outline"
                    title="Document Checklist"
                    description="View required documents for admission"
                    onPress={() => navigation.navigate('DocumentChecklist')}
                />

                <QuickActionCard
                    iconName="notifications-outline"
                    title="Set Up Notifications"
                    description="Stay updated on application status"
                    onPress={() => navigation.navigate('NotificationScreen')}
                />
            </View>

            {/* Important Information */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Important Information</Text>
                <Card style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Admission Timeline</Text>
                    <Text style={styles.infoText}>• Applications Open: [Date]</Text>
                    <Text style={styles.infoText}>• Document Submission: [Date]</Text>
                    <Text style={styles.infoText}>• Assessment Date: [Date]</Text>
                    <Text style={styles.infoText}>• Results Declaration: [Date]</Text>
                </Card>
            </View>

            {/* Help Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Need Help?</Text>
                <TouchableOpacity 
                    style={styles.helpButton}
                    onPress={() => navigation.navigate('Support')}
                >
                    <Text style={styles.helpButtonText}>Contact Support</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: '#007AFF',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        opacity: 0.9,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        flex: 1,
        marginLeft: 15,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    cardDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    infoCard: {
        padding: 15,
        backgroundColor: '#fff',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    helpButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    helpButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default WelcomeScreen;
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, ScrollView, ActivityIndicator } from "react-native";

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Replace this URL with your actual API endpoint
        const response = await fetch("https://api.example.com/student-profile");
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#1E88E5" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 16 }]}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: profileData.profileImage || "https://via.placeholder.com/100" }}
          style={styles.profileImage}
          accessibilityLabel={`Profile picture of ${profileData.name || "student"}`}
        />
        <Text style={styles.name}>{profileData.name || "N/A"}</Text>
        <Text style={styles.classText}>Class - {profileData.class || "N/A"}</Text>
        <Text style={styles.description}>
          {profileData.description || "No description available."}
        </Text>
      </View>

      {/* Student Details */}
      <View style={styles.detailsCard}>
        <DetailRow label="Date of Birth" value={profileData.dob} />
        <DetailRow label="Class" value={profileData.class} />
        <DetailRow label="Roll Number" value={profileData.rollNumber} />
        <DetailRow label="Parent's Number" value={profileData.parentNumber} />
        <DetailRow label="Father/Mother's Name" value={profileData.parentName} />
        <DetailRow label="Address" value={profileData.address} />
      </View>
    </ScrollView>
  );
};

// Component for rendering a single row in the details card
const DetailRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value || "N/A"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f2f5f9",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#e53935",
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#1E88E5",
    borderRadius: 12,
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  classText: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    marginTop: 8,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  rowLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  rowValue: {
    fontSize: 14,
    color: "#555",
  },
});

export default ProfileScreen;

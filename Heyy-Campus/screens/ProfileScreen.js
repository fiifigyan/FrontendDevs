import React, { useContext } from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity} from "react-native";
import { AuthContext } from "../context/AuthContext";
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const { userInfo = {} } = useContext(AuthContext);
  const navigation = useNavigation();

  const profileImage = userInfo?.profileImage || require("../assets/images/fiifi1.jpg");
  const fullName = [userInfo?.fname, userInfo?.lname].filter(Boolean).join(' ') || "N/A";
  const description = userInfo?.description || "No description available.";

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 16 }]}>
      <View style={styles.header}>
        <Image
          source={typeof profileImage === 'string' ? { uri: profileImage } : profileImage}
          style={styles.profileImage}
          accessibilityLabel={`Profile picture of ${fullName}`}
        />
        <Text style={styles.name}>{fullName}</Text>
        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => {navigation.navigate('EditProfile')}}
        >
          <Icon name="create-outline" size={22} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.description}>{description}</Text>
      </View>

      {/* Student Details */}
      <View style={styles.detailsCard}>
        <DetailRow label="Phone Number:" value={userInfo?.parentNumber} />
        <DetailRow label="Relationship:" value={userInfo?.parentName} />
        <DetailRow label="Address:" value={userInfo?.address} />
        <DetailRow label="Email:" value={userInfo?.email} />
        <DetailRow label="Occupation:" value={userInfo?.occupation} />

      </View>
    </ScrollView>
  );
};

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
  editProfileButton: {
    position: "absolute",
    top: 10,
    right: 10,
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

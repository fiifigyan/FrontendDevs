import React from 'react';
import { StatusBar, SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import DrawerNavigator from './navigation/StackNavigator';
import HomeScreen from './screens/tabs/HomeScreen';
import AdmissionForm from './screens/tabs/AdmissionForm';
import WelcomeScreen from './screens/tabs/WelcomeScreen';


// function AppContent() {
//   const { isLoading, userInfo } = React.useContext(AuthContext);

//   if (isLoading) {
//     return (
//       <View style={styles.spinnerContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//       </View>
//     );
//   }

//   return userInfo ? <DrawerNavigator /> : <AuthStack />;
// }

function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <NavigationContainer>
          <WelcomeScreen />
        </NavigationContainer>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;
import React, {useContext} from 'react';
import { SafeAreaView, StatusBar} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { AdmissionProvider } from './context/AdmissionContext';
import AuthStack from './navigation/AuthStack';
import DrawerNavigator from './navigation/StackNavigator';

function AppContent() {
  const { userInfo } = useContext(AuthContext);

  return (
    <>
      <StatusBar barStyle="light-content"/>
        <NavigationContainer>
          {userInfo ? (
              <DrawerNavigator />
            ) : (
              <AuthStack/>
            )
          }
        </NavigationContainer>      
    </>
  );
}

function App() {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#0074FF'}}>
      <AuthProvider>
        <AdmissionProvider>
          <AppContent />
        </AdmissionProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}

export default App;
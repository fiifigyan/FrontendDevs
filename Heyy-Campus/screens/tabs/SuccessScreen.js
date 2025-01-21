import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SuccessScreen = ({ 
  title = 'Success!',
  message = 'Operation completed successfully',
  buttonText = 'Done',
  backgroundColor = '#000080',
  checkmarkColor = '#00FF7F',
  onButtonPress,
  navigateTo,
  // Optional custom styles
  customContainerStyle,
  customButtonStyle,
  customTitleStyle,
  customMessageStyle,
}) => {
  const navigation = useNavigation();
  const checkmarkScale = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(checkmarkScale, {
      toValue: 1,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else if (navigateTo) {
      navigation.navigate(navigateTo);
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }, customContainerStyle]}>
      <View style={styles.content}>
        <Text style={[styles.title, customTitleStyle]}>{title}</Text>
        <Text style={[styles.subtitle, customMessageStyle]}>{message}</Text>
        
        <Animated.View 
          style={[
            styles.checkmarkContainer,
            { transform: [{ scale: checkmarkScale }] }
          ]}
        >
          <View style={[styles.checkmark, { backgroundColor: checkmarkColor }]}>
            <Text style={styles.checkmarkText}>✓</Text>
          </View>
        </Animated.View>

        <TouchableOpacity 
          style={[styles.button, customButtonStyle]}
          onPress={handlePress}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 40,
  },
  checkmarkContainer: {
    marginVertical: 30,
  },
  checkmark: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 50,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SuccessScreen;
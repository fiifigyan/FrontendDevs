import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Modal, StyleSheet } from 'react-native';

const SuccessModal = ({ 
  visible, 
  onClose, 
  title = 'Success!', 
  message = 'Operation completed successfully', 
  buttonText = 'Done', 
  backgroundColor = '#0077FF', 
  checkmarkColor = '#00FF7F', 
  customContainerStyle, 
  customButtonStyle, 
  customTitleStyle, 
  customMessageStyle 
}) => {
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      checkmarkScale.setValue(0);
      Animated.spring(checkmarkScale, {
        toValue: 1,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.container, customContainerStyle]}>
        <View style={[styles.content, { backgroundColor }]}>
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
            onPress={onClose}
          >
            <Text style={[styles.buttonText, { color: backgroundColor }]}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(42, 129, 243, 0.5)',
  },
  content: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  checkmarkContainer: {
    marginBottom: 20,
  },
  checkmark: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: 30,
    color: '#FFF',
  },
  button: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SuccessModal;
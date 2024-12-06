import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { verifyOTP } from '../../services/authService';

const VerifyOTPScreen = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params; // Email passed from the previous screen

  const handleVerifyOTP = async () => {
    if (!otp) {
      setErrorMessage('OTP cannot be empty.');
      return;
    }

    setIsLoading(true);

    try {
      await verifyOTP(email, otp);
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigation.replace('Login'); 
      }, 2000);
    } catch (error) {
      console.error('Verify OTP error:', error);
      setErrorMessage(error || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Icon */}
        <Image
          source={require('../../../assets/person.png')}
          style={styles.icon}
        />

        <Text style={styles.title}>Verify OTP</Text>
        <Text style={styles.subtitle}>Enter the OTP sent to your email</Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
            keyboardType="number-pad"
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <TouchableOpacity
          onPress={handleVerifyOTP}
          disabled={isLoading}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator style={styles.loader} />}
      </View>

      {/* Success Popup */}
      <Modal visible={showSuccessPopup} transparent animationType="fade">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>Password Reset!</Text>
            <Text style={styles.popupMessage}>
              Your new password has been emailed to you.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 20 },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    tintColor: 'rgba(34, 139, 34, 0.8)', // Green tint color
  },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, color: 'gray', marginBottom: 30 },
  formCard: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  errorText: { color: 'red', marginTop: 5 },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  loader: { marginTop: 20 },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
  },
  popupMessage: { fontSize: 14, color: 'gray', textAlign: 'center' },
});

export default VerifyOTPScreen;

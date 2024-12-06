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
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { requestPasswordReset } from '../../services/authService';

const RequestResetScreen = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const validateEmail = () => {
    if (!email) {
      setErrorMessage('Email field cannot be empty.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleRequestReset = async () => {
    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      await requestPasswordReset(email);
      Alert.alert('Success', 'OTP has been sent to your email.');
      navigation.navigate('VerifyOTP', { email }); // Navigate to OTP screen with email
    } catch (error) {
      console.error('Request reset error:', error);
      setErrorMessage(error || 'Failed to send OTP. Please try again.');
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

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive an OTP</Text>

        <View style={styles.formCard}>
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <TouchableOpacity
          onPress={handleRequestReset}
          disabled={isLoading}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending...' : 'Request OTP'}
          </Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator style={styles.loader} />}
      </View>
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
    tintColor: 'rgba(0, 122, 255, 0.8)', 
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
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  loader: { marginTop: 20 },
});

export default RequestResetScreen;

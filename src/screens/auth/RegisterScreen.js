import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {register} from '../../services/authService';

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigation = useNavigation();

  const validateInputs = () => {
    if (!fullName || !email || !password || !phone || !address) {
      setErrorMessage('All fields are required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/; // Allows 10 to 15 digits
    if (!phoneRegex.test(phone)) {
      setErrorMessage('Please enter a valid phone number.');
      return false;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      await register({fullName, email, password, phone, address});
      setShowSuccessPopup(true);
      setTimeout(() => {
        setShowSuccessPopup(false);
        navigation.replace('Login'); // Navigate back to Login screen
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Icon */}
        <Image
          source={require('../../../assets/download.png')}
          style={styles.icon}
        />

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join us and get started</Text>

        {/* Form */}
        <View style={styles.formCard}>
          <CustomTextField
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          <CustomTextField
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <CustomTextField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <CustomTextField
            placeholder="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <CustomTextField
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
          />

          {/* Error Message */}
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </View>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={isLoading}
          style={styles.registerButton}>
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {isLoading && <ActivityIndicator style={styles.loader} />}

        {/* Navigate to Login */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>

      {/* Success Popup */}
      <Modal visible={showSuccessPopup} transparent animationType="fade">
        <View style={styles.popupContainer}>
          <View style={styles.popup}>
            <Image
              source={require('../../../assets/download.png')} 
              style={styles.popupIcon}
            />
            <Text style={styles.popupTitle}>Registration Successful!</Text>
            <Text style={styles.popupMessage}>You can now log in.</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Custom Input Component
const CustomTextField = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}) => (
  <TextInput
    placeholder={placeholder}
    value={value}
    onChangeText={onChangeText}
    style={styles.input}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize="none"
  />
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F2F2F7'},
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {width: 80, height: 80, marginBottom: 20}, 
  title: {fontSize: 32, fontWeight: 'bold', color: 'black', marginBottom: 5},
  subtitle: {fontSize: 16, color: 'gray', marginBottom: 30},
  formCard: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    marginBottom: 20,
  },
  input: {
    padding: 15,
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  errorText: {color: 'red', fontSize: 14, marginTop: 5},
  registerButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  registerButtonText: {color: 'white', fontWeight: 'bold', fontSize: 16},
  loginLink: {color: '#007AFF', textDecorationLine: 'underline', fontSize: 14},
  loader: {marginTop: 10},
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    width: 250,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  popupIcon: {width: 60, height: 60, marginBottom: 10}, 
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  popupMessage: {fontSize: 14, color: 'gray'},
});

export default RegisterScreen;
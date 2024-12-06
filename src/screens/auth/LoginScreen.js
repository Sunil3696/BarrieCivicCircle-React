import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login } from '../../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomTextField = ({ placeholder, value, onChangeText, secureTextEntry, keyboardType }) => (
  <View style={styles.inputContainer}>
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={styles.input}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  </View>
);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setIsLoading(true);
  
    try {
      const data = await login(email, password);
      console.log('User logged in:', data);
  
      Alert.alert('Success', 'Login successful');
  
      // Navigate directly to the TabNavigator (home screen)
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainStackNavigator' }], 
      });
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../../assets/person.png')} 
          style={styles.icon}
        />

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Please log in to continue</Text>

        <View style={styles.formCard}>
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

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        </View>

        <TouchableOpacity onPress={handleLogin} disabled={isLoading} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>{isLoading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>

        {isLoading && <ActivityIndicator style={styles.loader} />}

        <TouchableOpacity onPress={() => navigation.navigate('RequestReset')}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerText}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    tintColor: 'rgba(0, 122, 255, 0.8)', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 30,
  },
  formCard: {
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    padding: 15,
    backgroundColor: '#F2F2F7',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(128, 128, 128, 0.5)',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  loginButton: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  forgotPassword: {
    marginTop: 15,
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  registerContainer: {
    position: 'absolute',
    bottom: 30,
  },
  registerText: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

// Login API call
import axios from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  try {
    console.log('Attempting to log in with:', { email, password });

    const response = await axios.post('/auth/login', { email, password });
    console.log('Login API response:', response.data);

    const { token } = response.data;

    // Save token to AsyncStorage for session management
    await AsyncStorage.setItem('userToken', token);
    console.log('Token saved to AsyncStorage:', token);

    return response.data; // Return the response data if needed
  } catch (error) {
    console.error('Error during login:', error.response || error.message);

    // Capture and throw the specific error message from the response
    throw error.response?.data?.error || 'Login failed';
  }
};


export const register = async (userData) => {
    try {
      console.log('Attempting registration with data:', userData);
  
      const response = await axios.post('/auth/register', userData);
      console.log('Registration successful:', response.data);
  
      return response.data; // Return the response data if needed
    } catch (error) {
      // Log the entire error for debugging purposes
      console.error('Error during registration:', error);
  
      // Handle different types of errors
      if (error.response) {
        console.log('Error response data:', error.response.data);
        console.log('Error response status:', error.response.status);
  
        // Throw specific error from the backend response
        throw error.response.data.error || 'Registration failed. Please try again.';
      } else if (error.request) {
        console.log('Error request:', error.request);
  
        // Handle errors where no response was received (e.g., network issues)
        throw 'Network error. Please check your connection and try again.';
      } else {
        console.log('Error message:', error.message);
  
        // Handle other unexpected errors
        throw 'An unexpected error occurred. Please try again later.';
      }
    }
  };

  export const requestPasswordReset = async (email) => {
    try {
      const response = await axios.post('/auth/request-reset', { email });
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to request password reset';
    }
  };
  
  export const verifyOTP = async (email, otp) => {
    try {
      const response = await axios.post('/auth/validate-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to verify OTP';
    }
  };
  
  

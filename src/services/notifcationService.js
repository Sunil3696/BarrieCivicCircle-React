import axios from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchNotifications = async () => {
  try {
    // Retrieve the token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');
console.log(token)
    if (!token) {
      throw new Error('Authentication token not found.');
    }

    // Make the request with the token in headers
    const response = await axios.get('/notification/user', {
      headers: {
        Authorization: `${token}`, // Pass token in Authorization header
      },
    });

    return response.data; // Returns the list of notifications
  } catch (error) {
    console.error('Error fetching notifications:', error?.response || error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch notifications.');
  }
};

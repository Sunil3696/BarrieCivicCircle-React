import axios from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('No token found');
    return token;
  } catch (error) {
    console.error('Failed to get token:', error.message);
    throw error;
  }
};

export const fetchUserProfile = async () => {
  try {
    const token = await getToken();
    const response = await axios.get('/auth/me', {
      headers: { Authorization: `${token}` },
    });
    console.log('User profile response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    throw new Error(error.response?.data?.error || 'Failed to fetch user profile.');
  }
};
export const fetchUserEvents = async () => {
    try {
      const token = await getToken(); // Fetch the token
      console.log('📋 Token:', token);
  
      // Ensure headers are passed as a separate object
      const response = await axios.post(
        'events/myevents', 
        {}, 
        {
          headers: {
            Authorization: `${token}`, 
          },
        }
      );
  
      console.log('✅ User events fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      const serverError = error.response?.data?.error;
      const errorMessage = serverError || 'Failed to fetch user events.';
      console.error('❌ Server error message:', serverError || 'No server error provided');
      throw new Error(errorMessage);
    }
  };
  
export const deleteUserEvent = async (eventId) => {
  try {
    const token = await getToken();
    const response = await axios.delete(`/events/${eventId}`, {
      headers: { Authorization: `${token}` },
    });
    console.log('Event deleted response:', response.data); 
  } catch (error) {
    console.error('Error deleting event:', error.message); 
    throw new Error(error.response?.data?.error || 'Failed to delete event.');
  }
};

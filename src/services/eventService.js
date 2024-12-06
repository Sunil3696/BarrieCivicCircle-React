import axios from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './apiClient';

// Fetch all events
export const fetchEvents = async () => {
  try {
    const response = await apiClient.get('/events');
    return response.data; // Return the list of events
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch events.');
  }
};

// Fetch event details by ID
export const fetchEventById = async (eventId) => {
    console.log("Fetching event details for ID:", eventId); // Debugging
    try {
      const response = await axios.get(`/events/${eventId}`);
      console.log("Event details response:", response.data); // Debugging
      return response.data; // Return the event details
    } catch (error) {
      console.error("Error fetching event details:", error?.response || error.message); // Debugging
      throw new Error(error.response?.data?.error || 'Failed to fetch event details.');
    }
  };

  export const likeEvent = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token not available.');
      }
      console.log(`[DEBUG] Sending like request for eventId: ${eventId} with token: ${token}`);
      
      const response = await axios.post(
        `/events/${eventId}/like`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      
      console.log('[DEBUG] Like response data:', response.data);
      return response.data.likes; // Return updated likes count
    } catch (error) {
      console.error('[ERROR] Failed to like event:', error.response || error.message);
      throw new Error(error.response?.data?.error || 'Failed to like the event.');
    }
  };
  
  // Join an event
  export const joinEvent = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token not available.');
      }
      console.log(`[DEBUG] Sending join request for eventId: ${eventId} with token: ${token}`);
      
      const response = await axios.post(
        `/events/${eventId}/join`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      
      console.log('[DEBUG] Join response data:', response.data);
      return response.data; // Return updated event data if applicable
    } catch (error) {
      console.error('[ERROR] Failed to join event:', error.response || error.message);
      throw new Error(error.response?.data?.error || 'Failed to join the event.');
    }
  };
  
  // Cancel participation in an event
  export const cancelParticipation = async (eventId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        throw new Error('Token not available.');
      }
      console.log(`[DEBUG] Sending cancel participation request for eventId: ${eventId} with token: ${token}`);
      
      const response = await axios.post(
        `/events/${eventId}/cancel`,
        {},
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      
      console.log('[DEBUG] Cancel participation response data:', response.data);
      return response.data; 
    } catch (error) {
      console.error('[ERROR] Failed to cancel participation:', error.response || error.message);
      throw new Error(error.response?.data?.error || 'Failed to cancel participation.');
    }
  };

  export const updateEvent = async (eventId, eventData) => {
    const { image, ...otherData } = eventData;
  
    const token = await AsyncStorage.getItem('userToken');
  
    const formData = new FormData();
  
    // Append other data fields to formData
    Object.entries(otherData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  
    // Append image file if available
    if (image) {
      formData.append('images', {
        uri: image,
        name: 'event_image.jpg', // You can change the file name as needed
        type: 'image/jpeg', // Adjust MIME type if needed
      });
    }
  
    try {
      const response = await axios.put(`/events/${eventId}`, formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('✅ Event updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating event:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || 'Failed to update event.');
    }
  };

  export const createEvent = async (eventData) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('📤 Token:', token);
  
      // Construct FormData
      const formData = new FormData();
      const { image, ...fields } = eventData;
  
      Object.entries(fields).forEach(([key, value]) => {
        console.log(`📋 Appending field: ${key} = ${value}`);
        formData.append(key, value);
      });
  
      if (image) {
        console.log('📤 Appending image:', image);
        formData.append('images', {
          uri: image,
          name: 'event_image.jpg',
          type: 'image/jpeg',
        });
      }
  
      console.log('📦 FormData ready for submission');
  
      // Send POST request
      const response = await axios.post('/events', formData, {
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('✅ Event created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating event:', error?.response?.data || error.message);
  
      // Extract and throw the server-provided error message
      const serverError = error?.response?.data?.error;
      throw new Error(serverError || 'Failed to create event.');
    }
  };
  
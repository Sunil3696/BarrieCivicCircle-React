import apiClient from './apiClient'; // Import your API client for making requests
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from './apiClient';
// Fetch all forums
export const fetchForums = async () => {
    try {
      const response = await apiClient.get('/forums');

      return response.data; 
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch forums.';
    }
  };
  

// Fetch a forum by ID
export const fetchForumById = async (forumId) => {
  try {
    const response = await apiClient.get(`/forums/${forumId}`);
    return response.data; // Return the detailed forum data
  } catch (error) {
    throw error.response?.data?.error || 'Failed to fetch forum details.';
  }
};

// Create a new forum post
export const createForumPost = async (title, content, image) => {
    try {
      const formData = new FormData();
  
      // Append title and content
      formData.append('title', title || 'Untitled');
      formData.append('content', content || 'No content');
  
      // Append image
      if (image) {
        formData.append('images', {
          uri: image,
          type: 'image/jpeg', 
          name: image.split('/').pop(), 
        });
      }
  
      // Retrieve token
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('No authentication token found.');
  
      console.log('FormData Details:', Array.from(formData)); // Debugging FormData
  
      // Send request
      const response = await apiClient.post('/forums', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `${token}`, // Add Bearer prefix
        },
      });
  
      return response.data; // Return created forum
    } catch (error) {
      console.error('Error creating post:', error.message || error);
      throw error.response?.data?.error || 'Failed to create forum post.';
    }
  };
  
  
  

// Like or unlike a forum post
export const likeForumPost = async (forumId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Authentication token is missing.');
  
      // Send the API request to like the forum post
      const response = await apiClient.post(`/forums/${forumId}/like`, {}, {
        headers: {
          Authorization: `${token}`,
        },
      });
  
      return response.data.likes; 
    } catch (error) {
      console.error('Error liking the forum post:', error.message || error);
      throw error.response?.data?.error || 'Failed to like the forum post.';
    }
  };
  
  // Add a comment to a forum post
  export const addCommentToForum = async (forumId, commentBody) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Authentication token is missing.');
  
      const response = await axios.post(
        `/forums/${forumId}/comment`,
        { text: commentBody },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      return response.data; // Return the updated forum data
    } catch (error) {
      console.error('Error adding comment:', error.message || error);
      throw error.response?.data?.error || 'Failed to add a comment.';
    }
  };

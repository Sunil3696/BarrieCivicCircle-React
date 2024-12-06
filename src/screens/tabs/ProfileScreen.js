import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchUserProfile, fetchUserEvents, deleteUserEvent } from '../../services/profileService';
import ProfileEventCard from '../../screens/tabs/ProfileEventCard';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();

  const loadProfile = async () => {
    try {
      const userData = await fetchUserProfile();
      setUser(userData);
      const events = await fetchUserEvents();
      setUserEvents(events);
      setErrorMessage(null); // Clear error message on successful load
    } catch (error) {
      setErrorMessage('Failed to load profile. Please try again.');
      console.error('Error loading profile:', error.message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Ensure refreshing stops
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteUserEvent(eventId);
      setUserEvents(userEvents.filter(event => event.id !== eventId));
      Alert.alert('Success', 'Event deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete event.');
      console.error('Error deleting event:', error.message);
    }
  };

  const handleEditEvent = (eventId) => {
    navigation.navigate('EditEvent', { eventId });
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      console.log('Token removed, logging out...');
      Alert.alert('Logged Out', 'You have been logged out successfully!');
      navigation.replace('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    loadProfile();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}

      {user && (
        <View style={styles.profileSection}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <Text style={styles.text}>Name: {user.fullName}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Phone: {user.phone}</Text>
          <Text style={styles.text}>Address: {user.address}</Text>
          <Text style={styles.text}>Joined: {new Date(user.createdAt).toLocaleDateString()}</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.createEventButton}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Text style={styles.createEventButtonText}>Create New Event</Text>
      </TouchableOpacity>

      <View style={styles.eventSection}>
        <Text style={styles.sectionTitle}>Your Events</Text>
        {userEvents.length > 0 ? (
          userEvents.map(event => (
            <ProfileEventCard
              key={event.id}
              event={event}
              onDelete={() => handleDeleteEvent(event.id)}
              onEdit={() => handleEditEvent(event.id)} // Pass event ID to edit
            />
          ))
        ) : (
          <Text style={styles.noEventsText}>No events available.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f8',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  profileSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  createEventButton: {
    backgroundColor: '#3498db',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  createEventButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventSection: {
    marginBottom: 20,
  },
  noEventsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;

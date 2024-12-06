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
import { useNavigation } from '@react-navigation/native';
import { fetchEvents } from '../../services/eventService';
import EventCard from './EventCard';

const EventListScreen = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data || []);
      setErrorMessage(null); // Clear error message on successful load
    } catch (error) {
      console.error('Error fetching events:', error);
      setErrorMessage('Failed to load events.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false); // Ensure refreshing stops
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const onRefresh = () => {
    setIsRefreshing(true);
    loadEvents();
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {events.length > 0 ? (
          events.map((event) => (
            <TouchableOpacity
              key={event.id || event._id}
              onPress={() => {
                console.log('Navigating to EventDetail with eventId:', event.id); // Debugging
                navigation.navigate('EventDetail', { eventId: event.id });
              }}
            >
              <EventCard event={event} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.emptyText}>No events available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EventListScreen;

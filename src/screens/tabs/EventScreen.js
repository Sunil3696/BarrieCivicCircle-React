import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchEvents } from '../../services/eventService';
import EventCard from './EventCard';

const EventListScreen = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
        setErrorMessage('Failed to load events.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      {errorMessage && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
      <ScrollView>
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

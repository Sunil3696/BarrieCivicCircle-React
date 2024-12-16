import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EventCard = ({ event }) => {
  const navigation = useNavigation();

  const firstImageUrl =
    event.images && event.images.length > 0
      ? `http://10.0.0.185:3000${event.images[0]}`
      : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('EventDetail', { eventId: event._id })}
    >
      {firstImageUrl && (
        <Image
          source={{ uri: firstImageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <Text style={styles.title}>{event.title || 'Untitled Event'}</Text>
      <Text style={styles.description} numberOfLines={2}>
        {event.description || 'No description available.'}
      </Text>

      <View style={styles.meta}>
        <Text style={styles.date}>
          {event.eventDateFrom} - {event.eventDateTo}
        </Text>
        <Text style={styles.participants}>
          Participants: {event.participants.length}/{event.totalParticipantsRange.max}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  participants: {
    fontSize: 12,
    color: '#28a745',
  },
});

export default EventCard;

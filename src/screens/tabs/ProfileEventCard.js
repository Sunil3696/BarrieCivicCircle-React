import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const ProfileEventCard = ({ event, onDelete, onEdit }) => {
  return (
    <View style={styles.card}>
      {event.images?.[0] && (
        <Image source={{ uri: `http://10.0.0.185:3000${event.images[0]}` }} style={styles.image} />
      )}
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.description}>{event.description}</Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{event.relativeTime}</Text>
        <Text style={styles.metaText}>Likes: {event.likesCount}</Text>
        <Text style={styles.metaText}>Participants: {event.participantCount}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#34495e',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileEventCard;

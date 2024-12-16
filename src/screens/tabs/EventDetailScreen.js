import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { fetchEventById, likeEvent, joinEvent, cancelParticipation } from '../../services/eventService';

const EventDetailScreen = ({ route }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEventById(eventId);
        setEvent(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to load event details.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleAction = async (action) => {
    setIsProcessing(true);
    try {
      let response;
      if (action === 'like') {
        response = await likeEvent(eventId);
        Alert.alert('Success', 'Like updated successfully.');
        setEvent((prev) => ({ ...prev, likes: response }));
      } else if (action === 'join') {
        response = await joinEvent(eventId);
        Alert.alert('Success', 'Joined the event successfully.');
        setEvent((prev) => ({
          ...prev,
          participants: [...prev.participants, {}],
        }));
      } else if (action === 'cancel') {
        response = await cancelParticipation(eventId);
        Alert.alert('Success', 'Participation cancelled.');
        setEvent((prev) => ({
          ...prev,
          participants: prev.participants.slice(0, -1),
        }));
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to process action.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      {event?.images?.[0] && (
        <Image source={{ uri: `http://10.0.0.185:3000${event.images[0]}` }} style={styles.image} />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{event?.title}</Text>
        <Text style={styles.description}>{event?.description}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Date:</Text>
            <Text style={styles.metaValue}>
              {event?.eventDateFrom} - {event?.eventDateTo}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Venue:</Text>
            <Text style={styles.metaValue}>{event?.venue}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Fee:</Text>
            <Text style={styles.metaValue}>{event?.eventFee}</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Participants:</Text>
            <Text style={styles.metaValue}>
              {event?.participants.length}/{event?.totalParticipantsRange.max}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Likes:</Text>
            <Text style={styles.metaValue}>{event?.likes || 0}</Text>
          </View>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.likeButton]}
            onPress={() => handleAction('like')}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processing...' : `❤️ Like (${event?.likes || 0})`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.joinButton]}
            onPress={() => handleAction('join')}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processing...' : '👤 Join'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => handleAction('cancel')}
            disabled={isProcessing}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? 'Processing...' : '❌ Cancel'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 20,
    lineHeight: 22,
  },
  metaContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    paddingTop: 15,
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '400',
    color: '#2c3e50',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#e74c3c',
  },
  joinButton: {
    backgroundColor: '#3498db',
  },
  cancelButton: {
    backgroundColor: '#7f8c8d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default EventDetailScreen;

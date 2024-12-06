import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { fetchNotifications } from '../../services/notifcationService';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
        setErrorMessage('Failed to fetch notifications.');
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const renderNotification = ({ item }) => {
    return (
      <View style={styles.notificationCard}>
        <Text style={styles.eventName}>{item.eventName}</Text>
        <Text style={styles.eventDate}>Event Date: {formatDate(item.eventDate)}</Text>
        <Text style={styles.createdAt}>
          Notification Created: {formatDate(item.createdAt)}
        </Text>
      </View>
    );
  };

  const formatDate = (isoDate) => {
    try {
      const date = new Date(isoDate);
      return date.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (error) {
      console.error('Error formatting date:', isoDate, error.message);
      return isoDate;
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No notifications available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      renderItem={renderNotification}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  createdAt: {
    fontSize: 12,
    color: '#888',
  },
});

export default NotificationsScreen;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ForumCard = ({ forum }) => {
  const navigation = useNavigation();

  const firstImageUrl =
    forum.images && forum.images.length > 0
      ? `http://172.20.10.2:3000${forum.images[0]}` // Adjust the base URL as per your API
      : null;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ForumDetail', { forumId: forum.id || forum._id })}
    >
      {/* Title Section */}
      <View style={styles.header}>
        <Text style={styles.title}>{forum.title || 'Untitled'}</Text>
        <Text style={styles.meta}>{forum.createdDate || 'Unknown Date'}</Text>
      </View>

      {/* Image Section */}
      {firstImageUrl && (
        <Image
          source={{ uri: firstImageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      {/* Content Section */}
      <Text style={styles.content} numberOfLines={3}>
        {forum.content || 'No content available.'}
      </Text>

      {/* Footer Section */}
      <View style={styles.footer}>
        <Text style={styles.meta}>
          By {forum.creator?.name || 'Anonymous'}
        </Text>
        <View style={styles.footerRight}>
          <Text style={styles.footerItem}>
            ❤️ {forum.totalLikes || 0}
          </Text>
          <Text style={styles.footerItem}>
            💬 {forum.totalComments || 0}
          </Text>
        </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  meta: {
    fontSize: 12,
    color: '#aaa',
  },
  content: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  footerRight: {
    flexDirection: 'row',
  },
  footerItem: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 10,
  },
});

export default ForumCard;

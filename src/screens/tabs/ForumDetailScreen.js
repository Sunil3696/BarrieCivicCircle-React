import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { fetchForumById, likeForumPost, addCommentToForum } from '../../services/forumService';

const ForumDetailScreen = ({ route }) => {
  const { forumId } = route.params;
  const [forum, setForum] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadForum();
  }, [forumId]);

  const loadForum = async () => {
    setIsLoading(true);
    try {
      const data = await fetchForumById(forumId);
      setForum(data);
    } catch (error) {
      console.error('Error fetching forum details:', error);
      Alert.alert('Error', 'Failed to load forum details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      await likeForumPost(forumId);
      loadForum(); // Refresh the forum data
    } catch (error) {
      console.error('Error liking the forum post:', error.message || error);
      Alert.alert('Error', 'Failed to like the forum post.');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await addCommentToForum(forumId, newComment);
      Alert.alert('Success', 'Comment added successfully!');
      setNewComment('');
      loadForum(); // Refresh forum details
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.loader} />;
  }

  return (
    <ScrollView style={styles.container}>
      {/* Forum Details */}
      <View style={styles.forumContainer}>
        <Text style={styles.title}>{forum?.title}</Text>
        <Text style={styles.meta}>
          By {forum?.creator?.name || 'Anonymous'} • {new Date(forum?.createdAt).toLocaleString()}
        </Text>
        {forum?.images && forum.images.length > 0 && (
          <Image
            source={{ uri: `http://172.20.10.2:3000${forum.images[0]}` }}
            style={styles.image}
          />
        )}
        <Text style={styles.content}>{forum?.content}</Text>
        <View style={styles.likeCommentSection}>
          <TouchableOpacity onPress={handleLike} style={styles.likeButton}>
            <Text style={styles.likeButtonText}>❤️ {forum?.likes.length || 0} Likes</Text>
          </TouchableOpacity>
          <Text style={styles.commentCount}>
            💬 {forum?.comments.length || 0} Comments
          </Text>
        </View>
      </View>

      {/* Comments Section */}
      <View style={styles.commentSection}>
        <Text style={styles.commentHeader}>Comments</Text>
        <FlatList
          data={forum?.comments || []}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.comment}>
              <Text style={styles.commentText}>{item.body}</Text>
              <Text style={styles.commentMeta}>
                By {item.creator?.name || 'Anonymous'} • {new Date(item.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No comments yet. Be the first to comment!</Text>}
        />
        {/* Add a Comment */}
        <View style={styles.commentInputSection}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={handleAddComment}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? 'Posting...' : 'Post'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  forumContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  meta: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  likeCommentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    backgroundColor: '#ff4d4d',
    padding: 8,
    borderRadius: 5,
  },
  likeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  commentCount: {
    fontSize: 14,
    color: '#555',
  },
  commentSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  commentHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  comment: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  commentMeta: {
    fontSize: 12,
    color: '#888',
  },
  commentInputSection: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default ForumDetailScreen;

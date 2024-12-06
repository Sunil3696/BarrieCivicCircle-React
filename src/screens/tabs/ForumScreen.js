import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchForums, createForumPost } from '../../services/forumService';
import ForumCard from '../../components/ForumCard';

const ForumScreen = () => {
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add Forum States
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch forums
  useEffect(() => {
    const loadForums = async () => {
      try {
        const data = await fetchForums();
        setForums(data || []);
      } catch (error) {
        console.error('Error fetching forums:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadForums();
  }, []);

  // Handle image selection
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.error('Image picker error: ', response.error);
      } else {
        const imageUri = response.assets?.[0]?.uri || response.uri;
        console.log('Selected image URI:', imageUri);
        setSelectedImage(imageUri);
      }
    });
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (!newPostTitle || !newPostContent) {
      Alert.alert('Error', 'Please fill in both the title and content.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createForumPost(newPostTitle, newPostContent, selectedImage);
      Alert.alert('Success', 'Your post has been created!');

      // Clear input fields
      setNewPostTitle('');
      setNewPostContent('');
      setSelectedImage(null);

      // Reload forums
      const data = await fetchForums();
      setForums(data || []);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create the post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Add Forum Section */}
      <View style={styles.addSection}>
        <Text style={styles.addTitle}>Create a Post</Text>

        <TextInput
          placeholder="Enter a title..."
          value={newPostTitle}
          onChangeText={setNewPostTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Write your forum or post here..."
          value={newPostContent}
          onChangeText={setNewPostContent}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.imagePreview}
          />
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.imageButton} onPress={openImagePicker}>
            <Text style={styles.imageButtonText}>Pick Image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.postButton, isSubmitting && styles.buttonDisabled]}
            onPress={handleCreatePost}
            disabled={isSubmitting}
          >
            <Text style={styles.postButtonText}>
              {isSubmitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Forums List */}
      <View style={styles.forumList}>
  {isLoading ? (
    <ActivityIndicator size="large" />
  ) : forums.length > 0 ? (
    forums.map((forum) => (
      <ForumCard key={forum.id || forum._id} forum={forum} />
    ))
  ) : (
    <Text style={styles.emptyText}>No forums available.</Text>
  )}
</View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  addSection: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  addTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 150,
    marginBottom: 12,
    borderRadius: 5,
  },
  forumList: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
});

export default ForumScreen;

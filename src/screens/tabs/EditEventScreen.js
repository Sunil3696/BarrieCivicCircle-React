import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Modal,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fetchEventById, updateEvent } from '../../services/eventService'; // Replace with your service implementation

const EditEventScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [eventDateFrom, setEventDateFrom] = useState(new Date());
  const [eventDateTo, setEventDateTo] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [minParticipants, setMinParticipants] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [eventFee, setEventFee] = useState('Free');
  const [isFeeModalVisible, setIsFeeModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const event = await fetchEventById(eventId);
        setTitle(event.title);
        setDescription(event.description);
        setVenue(event.venue);
        setContactNumber(event.contactNumber);
        setEventDateFrom(new Date(event.eventDateFrom));
        setEventDateTo(new Date(event.eventDateTo));
        setMinParticipants(event.totalParticipantsRange.min.toString());
        setMaxParticipants(event.totalParticipantsRange.max.toString());
        setEventFee(event.eventFee);
        setExistingImages(event.images || []);
      } catch (error) {
        console.error('Error loading event details:', error.message);
        Alert.alert('Error', 'Failed to load event details.');
      }
    };

    loadEventDetails();
  }, [eventId]);

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
      } else if (response.errorMessage) {
        console.error('Image picker error: ', response.errorMessage);
      } else {
        const imageUri = response.assets?.[0]?.uri || response.uri;
        setSelectedImage(imageUri);
        setExistingImages([]); // Clear existing images when a new image is selected
      }
    });
  };

  const handleDateChange = (event, selectedDate, type) => {
    if (event.type === 'dismissed') {
      if (type === 'start') setShowStartDatePicker(false);
      if (type === 'end') setShowEndDatePicker(false);
      return;
    }

    if (selectedDate) {
      if (type === 'start') {
        setEventDateFrom(selectedDate);
        setShowStartDatePicker(false);
      } else {
        setEventDateTo(selectedDate);
        setShowEndDatePicker(false);
      }
    }
  };

  const handleUpdateEvent = async () => {
    if (
      !title ||
      !description ||
      !venue ||
      !contactNumber ||
      !minParticipants ||
      !maxParticipants
    ) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (Number(minParticipants) > Number(maxParticipants)) {
      Alert.alert('Error', 'Min participants cannot exceed max participants.');
      return;
    }

    setIsSubmitting(true);

    try {
      await updateEvent(eventId, {
        title,
        description,
        venue,
        contactNumber,
        eventDateFrom: eventDateFrom.toISOString(),
        eventDateTo: eventDateTo.toISOString(),
        totalParticipantsRange: {
          min: Number(minParticipants),
          max: Number(maxParticipants),
        },
        eventFee,
        image: selectedImage,
      });

      Alert.alert('Success', 'Event updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating event:', error.message);
      Alert.alert('Error', 'Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Edit Event</Text>

        <TextInput
          placeholder="Event Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Event Description"
          value={description}
          onChangeText={setDescription}
          style={[styles.input, { height: 100 }]}
          multiline
        />

        <TextInput
          placeholder="Venue"
          value={venue}
          onChangeText={setVenue}
          style={styles.input}
        />

        <TextInput
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          style={styles.input}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            Start Date: {eventDateFrom.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showStartDatePicker && (
          <DateTimePicker
            value={eventDateFrom}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, 'start')}
          />
        )}

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            End Date: {eventDateTo.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showEndDatePicker && (
          <DateTimePicker
            value={eventDateTo}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => handleDateChange(event, date, 'end')}
          />
        )}

        <TextInput
          placeholder="Min Participants"
          value={minParticipants}
          onChangeText={setMinParticipants}
          style={styles.input}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Max Participants"
          value={maxParticipants}
          onChangeText={setMaxParticipants}
          style={styles.input}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setIsFeeModalVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>Event Fee: {eventFee}</Text>
        </TouchableOpacity>

        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
        )}

        {existingImages.map((image, index) => (
          <Image key={index} source={{ uri: `http://10.0.0.185:3000${image}` }} style={styles.imagePreview} />
        ))}

        <TouchableOpacity style={styles.imageButton} onPress={openImagePicker}>
          <Text style={styles.imageButtonText}>Pick New Image</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
          onPress={handleUpdateEvent}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update Event</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for Event Fee */}
      <Modal
        transparent={true}
        visible={isFeeModalVisible}
        animationType="slide"
        onRequestClose={() => setIsFeeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Event Fee</Text>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setEventFee('Free');
                setIsFeeModalVisible(false);
              }}
            >
              <Text>Free</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => {
                setEventFee('Paid');
                setIsFeeModalVisible(false);
              }}
            >
              <Text>Paid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f4',
      padding: 16,
    },
    form: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 12,
      borderRadius: 5,
      marginBottom: 12,
      backgroundColor: '#f9f9f9',
    },
    dateButton: {
      padding: 12,
      backgroundColor: '#3498db',
      borderRadius: 5,
      marginBottom: 12,
    },
    dateButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    dropdownButton: {
      padding: 12,
      backgroundColor: '#f9f9f9',
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
    },
    dropdownButtonText: {
      color: '#333',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    imagePreview: {
      width: '100%',
      height: 150,
      borderRadius: 5,
      marginBottom: 12,
    },
    imageButton: {
      backgroundColor: '#007AFF',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginBottom: 16,
    },
    imageButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    submitButton: {
      backgroundColor: '#28a745',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
    },
    submitButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      width: '80%',
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 10,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      textAlign: 'center',
    },
    modalOption: {
      padding: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });

export default EditEventScreen;

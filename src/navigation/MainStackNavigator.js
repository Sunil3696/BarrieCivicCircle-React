import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ForumDetailScreen from '../screens/tabs/ForumDetailScreen'; // Import your ForumDetailScreen
import EventDetailScreen from '../screens/tabs/EventDetailScreen';
import CreateEventScreen from '../screens/tabs/CreateEventScreen';
import EditEventScreen from '../screens/tabs/EditEventScreen';
const Stack = createNativeStackNavigator();

const MainStackNavigator = () => (
  <Stack.Navigator>
    {/* Tabs Navigator */}
    <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />

    {/* Forum Detail Screen */}
    <Stack.Screen
      name="ForumDetail"
      component={ForumDetailScreen}
      options={{ headerTitle: 'Forum Details' }}
    />
     <Stack.Screen
      name="EventDetail" // Corrected navigation name
      component={EventDetailScreen}
      options={{ headerTitle: 'Event Details' }}
    />
    <Stack.Screen
      name="CreateEvent"
      component={CreateEventScreen}
      options={{ headerTitle: 'Create Event' }}
    />
    <Stack.Screen
      name="EditEvent"
      component={EditEventScreen}
      options={{ headerTitle: 'Edit Event' }}
    />
  </Stack.Navigator>
);

export default MainStackNavigator;

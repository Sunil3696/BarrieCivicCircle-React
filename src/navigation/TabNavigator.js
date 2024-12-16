import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import ForumScreen from '../screens/tabs/ForumScreen';
import EventScreen from '../screens/tabs/EventScreen';
import NotificationScreen from '../screens/tabs/NotificationScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, size }) => {
        let imageSource;

        // Determine the image based on the route name
        switch (route.name) {
          case 'Forum':
            imageSource = focused
              ? require('../../assets/chats.png')
              : require('../../assets/chat.png');
            break;
          case 'Event':
            imageSource = focused
              ? require('../../assets/calendaract.png')
              : require('../../assets/calendar.png');
            break;
          case 'Notification':
            imageSource = focused
              ? require('../../assets/notificationact.png')
              : require('../../assets/notification.png');
            break;
          case 'Profile':
            imageSource = focused
              ? require('../../assets/users.png')
              : require('../../assets/user.png');
            break;
        }

        // Return the Image component
        return (
          <Image
            source={imageSource}
            style={{
              width: size,
              height: size,
              resizeMode: 'contain',
            }}
          />
        );
      },
      tabBarActiveTintColor: 'tomato', // Active tab color
      tabBarInactiveTintColor: 'gray', // Inactive tab color
    })}
  >
    <Tab.Screen name="Forum" component={ForumScreen} />
    <Tab.Screen name="Event" component={EventScreen} />
    <Tab.Screen name="Notification" component={NotificationScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default TabNavigator;

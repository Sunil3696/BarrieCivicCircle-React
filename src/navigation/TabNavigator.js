import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ForumScreen from '../screens/tabs/ForumScreen';
import EventScreen from '../screens/tabs/EventScreen';
import NotificationScreen from '../screens/tabs/NotificationScreen';
import ProfileScreen from '../screens/tabs/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons'; // Import your desired icon set

const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Forum':
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            break;
          case 'Event':
            iconName = focused ? 'calendar' : 'calendar-outline';
            break;
          case 'Notification':
            iconName = focused ? 'notifications' : 'notifications-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
        }

        // Return the icon component
        return <Icon name={iconName} size={size} color={color} />;
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
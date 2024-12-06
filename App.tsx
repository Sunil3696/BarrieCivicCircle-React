import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainStackNavigator from './src/navigation/MainStackNavigator';
import AuthStackNavigator from './src/navigation/AuthStackNavigator';

const App = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('userToken');
      setIsUserLoggedIn(!!token);
    };

    // Listen for changes in AsyncStorage
    const interval = setInterval(checkLoginStatus, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isUserLoggedIn ? <MainStackNavigator /> : <AuthStackNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import RequestResetScreen from '../screens/auth/RequestResetScreen';
import VerifyOTPScreen from '../screens/auth/VerifyOTPScreen';

const Stack = createNativeStackNavigator();

const AuthStackNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RequestReset" component={RequestResetScreen} options={{ title: 'Reset Password' }} />
    <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} options={{ title: 'Verify OTP' }} />
  </Stack.Navigator>
);

export default AuthStackNavigator;

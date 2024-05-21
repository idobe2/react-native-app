import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './src/screens/SignInScreen';
import Dashboard from './src/screens/Dashboard';
import RegistrationScreen from './src/screens/RegistrationScreen';  // Import the new screen

export type RootStackParamList = {
  SignIn: undefined;
  Dashboard: {
    user: any;
  };
  Registration: undefined;  // Add a type for the new screen if necessary
};

const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard as React.FC<{}>} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

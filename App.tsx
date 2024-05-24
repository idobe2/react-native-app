import * as React from 'react';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from './src/screens/SignInScreen';
import Dashboard from './src/screens/Dashboard';
import RegistrationScreen from './src/screens/RegistrationScreen';
import { EventRegister } from "react-native-event-listeners";
import theme from './src/theme/theme';
import themeContext from './src/theme/themeContext';

export type RootStackParamList = {
  SignIn: undefined;
  Dashboard: {
    user: any;
  };
  Registration: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [darkMode, setDarkMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    const listener = EventRegister.addEventListener("ChangeTheme", (data) => {
      setDarkMode(data);
      console.log("Dark mode: ", data);
  })
  return () => {
    EventRegister.removeAllListeners();
    }
}, [darkMode])

  return (
    <themeContext.Provider value={(darkMode === true ? theme.dark : theme.light) as any}>
    <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
      <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard as React.FC<{}>} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </themeContext.Provider>
  );
}

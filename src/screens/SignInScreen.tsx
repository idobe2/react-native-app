import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

WebBrowser.maybeCompleteAuthSession();

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState<any>(null);  // Specify a more detailed type for user info if known
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "336532324182-tdk022s4l242bl0739cdhius07hrap2h.apps.googleusercontent.com",
    iosClientId: "336532324182-l1i3l1qr6h8iu7jp2j4afkf29kec21e0.apps.googleusercontent.com",
    webClientId: "336532324182-9tel9tgcfnlef6g2mam6oftrtcvvs1ig.apps.googleusercontent.com",
  });

  useEffect(() => {
    async function signIn() {
      const user = await AsyncStorage.getItem("@user");
      if (!user && response?.type === "success" && response.authentication) {
        await getUserInfo(response.authentication.accessToken);
      } else if (user) {
        setUserInfo(JSON.parse(user));
      }
    }
    signIn();
  }, [response]);

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userInfoJson = await userInfoResponse.json();
      await AsyncStorage.setItem("@user", JSON.stringify(userInfoJson));
      setUserInfo(userInfoJson);
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>User Info:</Text>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
      <Button title="Delete local storage" onPress={() => AsyncStorage.removeItem("@user").then(() => setUserInfo(null))} />
      <Button title="Go to Dashboard" onPress={() => navigation.replace('Dashboard')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignInScreen;

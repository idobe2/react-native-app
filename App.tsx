import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import AsyncStorage from '@react-native-async-storage/async-storage';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "336532324182-tdk022s4l242bl0739cdhius07hrap2h.apps.googleusercontent.com",
    iosClientId: "336532324182-l1i3l1qr6h8iu7jp2j4afkf29kec21e0.apps.googleusercontent.com",
    webClientId: "336532324182-9tel9tgcfnlef6g2mam6oftrtcvvs1ig.apps.googleusercontent.com",
  });

  React.useEffect(() => {
    async function signIn() {
      handleSignInWithGoogle();
    }
    signIn();
  }, [response]);

  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success" && response.authentication) {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token: string) => {
    if (!token) return;
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
      <Button title="Delete local storage" onPress={() => AsyncStorage.removeItem("@user")} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

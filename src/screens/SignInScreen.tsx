import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import config from "./../core/config";
import axios from "axios";
import AuthAPI from "../api/auth-api";
import StudentAPI from "../api/student-api";

WebBrowser.maybeCompleteAuthSession();

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState<any>(null); // Specify a more detailed type for user info if known
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.androidClientId,
    iosClientId: config.iosClientId,
    webClientId: config.webClientId,
  });
  const [email, setEmail] = useState<string>(""); // Declare the email state variable
  const [password, setPassword] = useState<string>(""); // Declare the password state variable
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function signIn() {
      const user = await AsyncStorage.getItem("@user");
      if (user) {
        const userObj = JSON.parse(user);
        const student = await StudentAPI.getStudent(userObj.accessToken);
        if (student) {
          setUserInfo(userObj);
          navigation.replace("Dashboard", { user: userObj });
        } else {
          console.log("Failed to load student");
          const res = await AuthAPI.refreshTokens(userObj.refreshToken);
          if (res) {
            const updatedUser = {
              ...userObj,
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            };
            await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
            setUserInfo(updatedUser);
            console.log("Updated access token: ", res.accessToken);
            console.log("Updated refresh token: ", res.refreshToken);
            navigation.replace("Dashboard", { user: updatedUser });
          }
          else {
            await AsyncStorage.removeItem("@user");
            console.log("Failed to refresh tokens");
          }
        }
      } else if (response?.type === "success" && response.authentication) {
        // console.log("response: ", response.authentication);
        await getUserInfo(response.authentication);
      }
    }
    signIn();
  }, [response]);

  const getUserInfo = async (token: any) => {
    if (!token) return;
    try {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token.accessToken}` },
        }
      );
      const userInfoJson = await userInfoResponse.json();
      await AsyncStorage.setItem("@user", JSON.stringify(userInfoJson));
      setUserInfo(userInfoJson);
      // console.log("androidClientId: ", config.androidClientId, "token: ", token);
      const responseFromServer = await AuthAPI.googleSingIn(config.androidClientId, token.idToken);
      if (responseFromServer.message === "Login successful") {
        console.log("responseFromServer: ", responseFromServer);
        const updatedUserInfo = {
          ...userInfoJson,
          ...responseFromServer,
        };  
        await AsyncStorage.setItem("@user", JSON.stringify(updatedUserInfo));
        setUserInfo(updatedUserInfo);
        alert("Google login successful");
        navigation.replace("Dashboard", { user: updatedUserInfo });
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  };

  const onLoginPressed = async () => {
    setIsLoading(true);
    console.log(email, password);
    try {
      const responseFromServer = await axios.post(
        `${config.serverAddress}/auth/login`,
        { email, password }
      );
      if (responseFromServer.status === 200) {
        console.log("Login successful");
        alert("Login successful");
        await AsyncStorage.setItem("@user", JSON.stringify(responseFromServer.data));
        setUserInfo(responseFromServer.data);
        if (userInfo) navigation.replace("Dashboard", { user: userInfo });
        else navigation.replace("Dashboard", { user: responseFromServer.data});
      } else {
        console.log("Login failed with status: ", responseFromServer.status);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Error is an AxiosError, now you can access error.response, error.message, etc.
        console.log("Login failed with error: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
          alert(`Login failed: ${error.response.data.message}`);
        } else {
          alert("Login failed: Network error or server is down");
        }
      } else {
        // Error is not an AxiosError, handle it differently
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    } finally { setIsLoading(false); }
  };

  return (
    <View style={styles.container}>
      {/* <Text>User Info:</Text>
      <Text>{JSON.stringify(userInfo, null, 2)}</Text> */}
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : ( <Button title="Sign in" onPress={onLoginPressed} /> )}
      <Button title="Sign in with Google" onPress={() => promptAsync()} />
        <Button
          title="Register"
          onPress={() => navigation.push("Registration")}
        />
        <Text style={styles.title}>{"\nDev"}</Text>
        <Button
          title="Delete local storage"
          onPress={() =>
            AsyncStorage.removeItem("@user").then(() => setUserInfo(null))
          }
        />
        <Button
          title="Go to Dashboard"
          onPress={() => navigation.replace("Dashboard", { user: userInfo })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "60%",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default SignInScreen;

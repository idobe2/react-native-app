import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import config from "./../core/config";
import AuthAPI from "../api/auth-api";
import StudentAPI from "../api/student-api";
import themeContext from "../theme/themeContext";
import { EventRegister } from "react-native-event-listeners";
import Icon from "react-native-vector-icons/Feather";

WebBrowser.maybeCompleteAuthSession();

type SignInScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignIn"
>;

interface SignInScreenProps {
  navigation: SignInScreenNavigationProp;
}

const SignInScreen: React.FC<SignInScreenProps> = ({ navigation }) => {
  const theme = useContext(themeContext) as any;
  const [userInfo, setUserInfo] = useState<any>(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: config.androidClientId,
    iosClientId: config.iosClientId,
    webClientId: config.webClientId,
  });
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);

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
          const res = await AuthAPI.refreshTokens(userObj.refreshToken);
          if (res) {
            const updatedUser = {
              ...userObj,
              accessToken: res.accessToken,
              refreshToken: res.refreshToken,
            };
            await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
            setUserInfo(updatedUser);
            navigation.replace("Dashboard", { user: updatedUser });
          } else {
            await AsyncStorage.removeItem("@user");
            console.log("Failed to refresh tokens");
          }
        }
      } else if (response?.type === "success" && response.authentication) {
        setUserInfo(await AuthAPI.getUserInfo(response.authentication));
        try {
          const responseFromServer = await AuthAPI.googleSingIn(
            config.androidClientId,
            response.authentication.idToken as string
          );
          if (responseFromServer.message === "Login successful") {
            const updatedUserInfo = {
              ...userInfo,
              ...responseFromServer,
            };
            await AsyncStorage.setItem(
              "@user",
              JSON.stringify(updatedUserInfo)
            );
            setUserInfo(updatedUserInfo);
            alert("Google login successful");
            navigation.replace("Dashboard", { user: updatedUserInfo });
          }
        } catch (error) {
          console.error("Failed to fetch user info:", error);
        }
      }
    }
    signIn();
  }, [response]);

  const onLoginPressed = async () => {
    setIsLoading(true);
    const responseFromServer = await AuthAPI.signIn(email, password);
    if (responseFromServer) {
      alert("Login successful");
      setUserInfo(responseFromServer);
      await AsyncStorage.setItem("@user", JSON.stringify(responseFromServer));
      navigation.replace("Dashboard", { user: responseFromServer });
    }
    setIsLoading(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    EventRegister.emit("ChangeTheme", !darkMode);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <TouchableOpacity style={styles.iconContainer} onPress={toggleDarkMode}>
        <Icon name="sun" size={30} color={theme.color} />
      </TouchableOpacity>
      <Image source={require("../assests/logo.png")} style={styles.logo} />
      <Text style={[styles.title, { color: theme.color }]}>Sign In</Text>
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        placeholder="Password"
        placeholderTextColor="grey"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.color} />
        ) : (
          <TouchableOpacity style={styles.button} onPress={onLoginPressed}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.googleButton]}
          onPress={() => promptAsync()}
        >
          <Text style={styles.buttonText}>Sign in with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.push("Registration")}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
        {/* <Text style={[styles.devText, { color: theme.color }]}>{"\nDev"}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => AsyncStorage.removeItem("@user").then(() => setUserInfo(null))}
        >
          <Text style={styles.buttonText}>Delete local storage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace("Dashboard", { user: userInfo })}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    width: "80%",
    marginTop: 20,
    alignItems: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  googleButton: {
    backgroundColor: "#db4437",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  devText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
  },
  logo: {
    maxWidth: 250,
    maxHeight: 75,
    width: '100%',
    marginBottom: 20,
  },
});

export default SignInScreen;

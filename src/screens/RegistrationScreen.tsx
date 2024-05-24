import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { emailValidator } from "../helpers/EmailValidator";
import {
  passwordValidator,
  passwordMatchValidator,
} from "../helpers/PasswordValidator";
import PhotoAPI from "../api/photo-api";
import AuthAPI from "../api/auth-api";
import StudentApi from "../api/student-api";
import config from "../core/config";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../App";
import themeContext from "../theme/themeContext";

type RegistrationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Registration"
>;

interface RegistrationScreenProps {
  navigation: RegistrationScreenNavigationProp;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  navigation,
}) => {
  const theme = useContext(themeContext) as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const handleUserRegistration = async () => {
    setIsLoading(true);
    if (name === "" || age === "") {
      Alert.alert("Error", "Please fill in all fields");
      setIsLoading(false);
      return;
    }
    if (emailValidator(email) !== "") {
      Alert.alert("Error", emailValidator(email));
      setIsLoading(false);
      return;
    }
    if (passwordValidator(password) !== "") {
      Alert.alert("Error", passwordValidator(password));
      setIsLoading(false);
      return;
    }
    if (passwordMatchValidator(password, confirmPassword) !== "") {
      Alert.alert("Error", "Passwords do not match");
      setIsLoading(false);
      return;
    }
    const response = await AuthAPI.registerUser(email, password);
    if (response) {
      await new Promise((f) => setTimeout(f, 5000));
      const token = await AuthAPI.getAccessToken(email, password);
      const photo_res = await handlePhotoSubmit();
      const student_res = await StudentApi.addStudent(
        {
          _id: AuthAPI.extractIdFromResponse(response.request._response),
          name,
          age,
          image: photo_res,
        },
        token
      );
      if (student_res) {
        alert("Register successful");
        setImage("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
        setAge("");
        navigation.replace("SignIn");
      }
    }
    setIsLoading(false);
  };

  const pickImage = async (source: "camera" | "gallery") => {
    if (source === "camera") {
      try {
        const pickerResult = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        if (!pickerResult.canceled && pickerResult.assets.length > 0) {
          const uri = pickerResult.assets[0].uri;
          setImage(uri);
        }
      } catch (error) {
        console.error("Failed to open camera", error);
      }
    } else {
      try {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        if (!pickerResult.canceled && pickerResult.assets.length > 0) {
          const uri = pickerResult.assets[0].uri;
          setImage(uri);
        }
      } catch (error) {
        console.error("Failed to open gallery", error);
      }
    }
  };

  const handlePhotoSubmit = async () => {
    const res = await PhotoAPI.submitPhoto(image);
    if (res !== "") {
      setImage(res);
      return res;
    } else {
      console.log("Failed to submit photo");
      return `${config.serverAddress}/uploads/avagreen.png`;
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Text style={[styles.title, { color: theme.color }]}>Register</Text>
      <View style={styles.avatarContainer}>
        {image === "" ? (
          <Image
            source={require("../assests/avagreen.png")}
            style={styles.avatar}
          />
        ) : (
          <Image source={{ uri: image }} style={styles.avatar} />
        )}
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => pickImage("camera")}>
            <Ionicons
              name="camera"
              style={[styles.icon, { color: theme.color }]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => pickImage("gallery")}>
            <Ionicons
              name="image"
              style={[styles.icon, { color: theme.color }]}
            />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        placeholder="Name"
        placeholderTextColor="grey"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        placeholder="Age"
        placeholderTextColor="grey"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        placeholder="Email"
        placeholderTextColor="grey"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        placeholder="Password"
        placeholderTextColor="grey"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        placeholder="Confirm Password"
        placeholderTextColor="grey"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={handleUserRegistration}
        >
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  avatarContainer: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
  },
  icon: {
    fontSize: 35,
    color: "black",
  },
});

export default RegistrationScreen;

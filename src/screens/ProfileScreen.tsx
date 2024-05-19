import React, { useState, useCallback } from "react";
import { Alert, View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity } from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import config from "../core/config";
import { RouteProp } from "@react-navigation/native";
import PostsComponent from "../components/PostsComponent";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import StudentApi from "../api/student-api";

interface UserInfo {
  _id: string;
  name: string;
  age: number;
  image: string;
}

type ProfileRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface ProfileProps {
  route: ProfileRouteProp;
}

const Profile: React.FC<ProfileProps> = ({ route }) => {
  const { user } = route.params;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [image, setImage] = useState('');
  const [changesMade, setChangesMade] = useState(false);
  const maxRetries = 3;
  let retryCount = 0;

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        try {
          const responseFromServer = await axios.get<UserInfo>(
            `${config.serverAddress}/student/${user.accessToken}`,
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );
          if (responseFromServer.status === 200) {
            console.log("Profile loaded successfully");
            setUserInfo(responseFromServer.data);
            setName(responseFromServer.data.name);
            setAge(responseFromServer.data.age.toString());
            setImage(responseFromServer.data.image);
          }
        } catch (error) {
          console.error("Profile loading failed with error: ", error);
        }
      };

      fetchUserInfo();
    }, [user._id, user.accessToken])
  );

  const handleInputChange = (newValue: string, field: 'name' | 'age') => {
    setChangesMade(true);
    if (field === 'name') {
      setName(newValue);
    } else {
      setAge(newValue);
    }
  };

  const handleSave = async () => {
    const newUserInfo = { 
      _id: userInfo?._id, 
      name: name, 
      age: age, 
      image: image};
    await StudentApi.deleteStudent(user.accessToken, userInfo?._id);
    await StudentApi.submitStudent(newUserInfo, user.accessToken);
    console.log("Saving", { name, age, image });
    setChangesMade(false);
    Alert.alert("Changes saved successfully");
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    let pickerResult;
    if (source === 'camera') {
      pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
    } else {
      pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
    }
    if (!pickerResult.canceled && pickerResult.assets) {
      const uri = pickerResult.assets[0].uri;
      setImage(uri);
      setChangesMade(true);
    }
  };

  const promptForImageSource = () => {
    Alert.alert(
      "Select Image Source",
      "Choose where to get your image from:",
      [
        { text: "Camera", onPress: () => pickImage('camera') },
        { text: "Gallery", onPress: () => pickImage('gallery') },
        { text: "Cancel", onPress: () => console.log("User canceled image pick"), style: "cancel" }
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={promptForImageSource} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Image source={require('../assests/avagreen.png')} style={styles.image} />
        )}
        <Ionicons name="pencil" size={24} color="black" style={styles.editIcon} />
      </TouchableOpacity>
      <TextInput
        value={name}
        onChangeText={(text) => handleInputChange(text, 'name')}
        style={styles.input}
        placeholder="Name"
      />
      <TextInput
        value={age}
        onChangeText={(text) => handleInputChange(text, 'age')}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Age"
      />
      {changesMade && <Button title="Save Changes" onPress={handleSave} />}
      <PostsComponent fetchUrl={`/post/find/${userInfo?._id}`} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: 'absolute',
    right: -10,
    bottom: 0,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    marginBottom: 12,
  }
});

export default Profile;

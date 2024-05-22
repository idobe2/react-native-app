// ProfileScreen.tsx
import React, { useState, useCallback, useContext } from "react";
import { Alert, View, StyleSheet, Modal } from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import config from "../core/config";
import { RouteProp } from "@react-navigation/native";
import PostsComponent from "../components/PostsComponent";
import * as ImagePicker from 'expo-image-picker';
import ProfileView from '../components/ProfileView';
import ProfileEdit from '../components/ProfileEdit';
import StudentApi from "../api/student-api";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../theme/themeContext";

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

const ProfileScreen: React.FC<ProfileProps> = ({ route }) => {
  const { user } = route.params;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [image, setImage] = useState('');
  const [changesMade, setChangesMade] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const theme = useContext(themeContext) as any;
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
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
      image: image || userInfo?.image};
    await StudentApi.deleteStudent(user.accessToken, userInfo?._id);
    await StudentApi.submitStudent(newUserInfo, user.accessToken);
    console.log("Saving", { name, age, image });
    setChangesMade(false);
    setIsEditing(false);
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
    <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>
      <Modal
        animationType="slide"
        transparent={false}
        visible={isEditing}
        onRequestClose={() => setIsEditing(false)}
      >
        <ProfileEdit
          name={name}
          age={age}
          image={image}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          onInputChange={handleInputChange}
        />
      </Modal>
      {userInfo && (
        <ProfileView
          name={name}
          age={age}
          image={image}
          onEdit={() => setIsEditing(true)}
          onImagePick={promptForImageSource}
        />
      )}
      {userInfo && <PostsComponent fetchUrl={`/post/find/${userInfo._id}`} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ProfileScreen;

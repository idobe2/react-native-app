import React, { useState, useCallback, useContext } from "react";
import { Alert, View, StyleSheet, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { RouteProp } from "@react-navigation/native";
import PostsComponent from "../components/PostsComponent";
import * as ImagePicker from 'expo-image-picker';
import ProfileView from '../components/ProfileView';
import ProfileEdit from '../components/ProfileEdit';
import StudentApi from "../api/student-api";
import themeContext from "../theme/themeContext";
import AuthAPI from "../api/auth-api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const fetchUserInfo = async () => {
    const responseFromServer = await StudentApi.getStudent(user.accessToken);
      if (responseFromServer) {
        setUserInfo(responseFromServer);
        setName(responseFromServer.name);
        setAge(responseFromServer.age.toString());
        setImage(responseFromServer.image);
      } else {
        const res = await AuthAPI.refreshTokens(user.refreshToken);
        if (res) {
          const updatedUser = {
            ...user,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          };
          await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
          console.log("Tokens refreshed");
          user.accessToken = res.accessToken;
          fetchUserInfo(); // retry fetching with new tokens
        } else {
          await AsyncStorage.removeItem("@user");
          console.log("Failed to refresh tokens");
        }
      }
  };

  useFocusEffect(
    useCallback(() => {
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
      await StudentApi.updateStudent(newUserInfo, user.accessToken);
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
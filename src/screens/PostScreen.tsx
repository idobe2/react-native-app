import React, { useState } from "react";
import { Alert, View, Text, TextInput, Button, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Make sure to install @react-native-picker/picker
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import config from "../core/config";
import * as ImagePicker from 'expo-image-picker';
import PhotoAPI from '../api/photo-api';

type PostRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface PostProps {
  route: PostRouteProp;
}
const Post: React.FC<PostProps> = ({ route }) => {
  const { user } = route.params;
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('books');
  const [price, setPrice] = useState<number>(0);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    console.log("Submiting post: ", { title, message, category, price, image });
      const res = await handlePhotoSubmit();
      console.log("Photo submitted", res);
    try {
      const responseFromServer = await axios.post(
        `${config.serverAddress}/post`,
        { title, message, category, price, image: res},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log("user" , user.accessToken);
      if (responseFromServer.status === 201) {
        console.log("Post created successfully");
      }  
        else { console.log("No photo to submit"); }
        console.log("Post created successfully");
        alert('Post submitted!');
        setTitle('');
        setMessage('');
        setCategory('');
        setPrice(0);
        setImage('');
      
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Posting failed with error: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
          alert(`Posting failed: ${error.response.data.message}`);
        } else {
          alert("Posting failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    } finally { setIsLoading(false); }
  };

  // ********** Image ********** //
  const pickImage = async (source: 'camera' | 'gallery') => {
    if (source === 'camera') {
      console.log('Camera selected');
      try {
        const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
        if (!pickerResult.canceled && pickerResult.assets.length > 0) {
          const uri = pickerResult.assets[0].uri;
          setImage(uri);
        }

      } catch (error) { console.error('Failed to open camera', error); }
    } 
    else {
      console.log('Gallery selected');
      try {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
        });
        if (!pickerResult.canceled && pickerResult.assets.length > 0) {
          const uri = pickerResult.assets[0].uri;
          setImage(uri);
        } 
      } catch (error) { console.error('Failed to open gallery', error); }
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

  const handlePhotoSubmit = async () => {
    console.log('handlePhotoSubmit: ', image);
    const res = await PhotoAPI.submitPhoto(image);
    if (res !== "") {
      console.log('res from handlePhotoSubmit:\n', res);
      setImage(res);
      return res;
    }
    else { console.log('Failed to submit photo'); }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text style={styles.label}>Message:</Text>
      <TextInput
        style={styles.input}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter message"
        multiline
      />
      <Text style={styles.label}>Category:</Text>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue as string)}
        >
        <Picker.Item label="Books" value="books" />
        <Picker.Item label="Clothing" value="clothes" />
        <Picker.Item label="Home decor and furniture" value="home" />
        <Picker.Item label="Videogames" value="videogames" />
        <Picker.Item label="Consumer electronics" value="electronics" />
        <Picker.Item label="Smartphones" value="smartphones" />
        <Picker.Item label="Computers" value="computers" />
        </Picker>
        <Text style={styles.label}>Price (₪):</Text>
      <TextInput
        style={styles.input}
        value={price.toString()}
        onChangeText={(text) => setPrice(Number(text))}
        placeholder="Enter price"
        keyboardType="numeric"
      />
      <Text style={styles.label}>Image:</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={promptForImageSource}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image source={require('../assests/cloud-upload-icon.png')} style={styles.image} />
          )}
        </TouchableOpacity>
      </View>
      {isLoading ? (
      <ActivityIndicator size="large" />
      ) : ( <Button title="Submit Post" onPress={handleSubmit} /> )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 350,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default Post;

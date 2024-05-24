import React, { useState, useContext } from "react";
import { Alert, View, Text, TextInput, Button, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import PhotoAPI from '../api/photo-api';
import themeContext from "../theme/themeContext";
import AuthAPI from "../api/auth-api";
import PostAPI from "../api/post-api";

type PostRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface PostProps {
  route: PostRouteProp;
}
const Post: React.FC<PostProps> = ({ route }) => {
  const { user } = route.params;
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('books');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext) as any;

  const handleSubmit = async () => {
    setIsLoading(true);
    const res = await handlePhotoSubmit();
    const Post: any = {
      title,
      message,
      category,
      price: Number(price),
      image: res as string,
    }
    const post: any = await PostAPI.addPost(Post, user.accessToken);
    if (post) {
        alert('Post submitted!');
        setTitle(post.title);
        setMessage(post.message);
        setCategory(post.category);
        setPrice(post.price);
        setImage(post.image);
      } 
      else {
        const res = await AuthAPI.refreshTokens(user.refreshToken);
        if (res) {
          console.log("Tokens refreshed");
          user.accessToken = res.accessToken;
          user.refreshToken = res.refreshToken;
          const post: any = await PostAPI.addPost(Post, user.accessToken);
          if (post) {
            alert('Post submitted!');
            setTitle(post.title);
            setMessage(post.message);
            setCategory(post.category);
            setPrice(post.price);
            setImage(post.image);
          } 
          alert('Post submitted!');
        }
      }
      setIsLoading(false);
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    const pickerResult = await (source === 'camera'
      ? ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      })
      : ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      })
    );

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
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
    const res = await PhotoAPI.submitPhoto(image);
    if (res) {
      setImage(res);
      return res;
    }
    console.log('Failed to submit photo');
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.label, { color: theme.color }]}>Title:</Text>
      <TextInput
        placeholderTextColor="grey"
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />
      <Text style={[styles.label, { color: theme.color }]}>Message:</Text>
      <TextInput
        placeholderTextColor="grey"
        style={[styles.textArea, { color: theme.color, borderColor: theme.color }]}
        value={message}
        onChangeText={setMessage}
        placeholder="Enter description"
        multiline
      />
      <Text style={[styles.label, { color: theme.color }]}>Category:</Text>
      <View style={[styles.pickerContainer, { borderColor: theme.color }]}>
        <Picker
          selectedValue={category}
          onValueChange={(itemValue) => setCategory(itemValue as string)}
          style={{ color: theme.color }}
        >
          <Picker.Item label="Books" value="books" />
          <Picker.Item label="Clothing" value="clothes" />
          <Picker.Item label="Home decor and furniture" value="home" />
          <Picker.Item label="Videogames" value="videogames" />
          <Picker.Item label="Consumer electronics" value="electronics" />
          <Picker.Item label="Smartphones" value="smartphones" />
          <Picker.Item label="Computers" value="computers" />
        </Picker>
      </View>
      <Text style={[styles.label, { color: theme.color }]}>Price (₪):</Text>
      <TextInput
        placeholderTextColor="grey"
        style={[styles.input, { color: theme.color, borderColor: theme.color }]}
        value={price}
        onChangeText={(text) => setPrice(text)}
        placeholder="Enter price"
        keyboardType="numeric"
      />
      <Text style={[styles.label, { color: theme.color }]}>Image:</Text>
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
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Post</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  input: {
    height: 40,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  textArea: {
    height: 100,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
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
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Post;

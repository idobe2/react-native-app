import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import config from './../core/config';
import { emailValidator } from '../helpers/EmailValidator';
import { passwordValidator } from '../helpers/PasswordValidator';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import FormData from 'form-data';
import StudentModel from '../model/StudentModel';
import PhotoAPI from '../api/photo-api';

const RegistrationScreen: React.FC = () => {

  // User input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  // const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Access token state
  const [accessToken, setAccessToken] = useState('');

  const handleUserRegistration = async () => {
    setIsLoading(true);
    if (name === '' || age === '') {
      Alert.alert('Error', 'Please fill in all fields and upload an avatar');
      setIsLoading(false);
      return;
    }
    if (emailValidator(email) !== '') {
      Alert.alert('Error', emailValidator(email));
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      setIsLoading(false);
      return;
    }
    if (passwordValidator(password) !== '') {
      Alert.alert('Error', passwordValidator(password));
      setIsLoading(false);
      return;
    }
    try {
      const responseFromServer = await axios.post(`${config.serverAddress}/auth/register`,
        { email, password }
      );
      if (responseFromServer.status === 200) {
        console.log("User: Register successful");
        await new Promise(f => setTimeout(f, 5000));
        await handleStudentRegistration(extractIdFromResponse(responseFromServer.request._response));
      } else { console.log("Login failed with status: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Error is an AxiosError, now you can access error.response, error.message, etc.
        console.log("Login failed with error: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
          alert("Login failed: user already exists");
        } else { alert("Login failed: Network error or server is down"); }
      } else {
        // Error is not an AxiosError, handle it differently
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    }
    finally { setIsLoading(false); }
  };

  const extractIdFromResponse = (response: string): string => {
    try {
      const parsedResponse = JSON.parse(response);
      console.log("id: ", parsedResponse._id);
      return parsedResponse._id; // Access the _id field
    } catch (error) {
      console.error("Failed to parse JSON", error);
      return ""; // Return an empty string or handle the error as needed
    }
  };

  const getAccessToken = async () => {
    try {
      const responseFromServer = await axios.post(
        `${config.serverAddress}/auth/login`,
        { email, password }
      );
      if (responseFromServer.status === 200) {
        setAccessToken(responseFromServer.data.accessToken);
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
    }
  }

  const handleStudentRegistration = async (_id: String) => {
    await getAccessToken();
    console.log("Access token: ", accessToken);
    try {
      if (image != "") {
        console.log("Uploading image");
        // const url = await StudentModel.uploadImage(avatarUri);
        // console.log("got url: ", url);
        // setImage(url);
      }
      const responseFromServer = await axios.post(`${config.serverAddress}/student`,
        { _id, name, age, image },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (responseFromServer.status === 201) {
        console.log("Student: Register successful");
        alert("Register successful");
        // Clear the input fields
        // setEmail('');
        // setPassword('');
        // setConfirmPassword('');
        // setName('');
        // setAge('');
      }
      else {
        console.log("Login failed with status: ", responseFromServer.status);
      }
    }
    catch (error: unknown) {
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
    }
  };

  const pickImage = async (source: 'camera' | 'gallery') => {
    // Implement image picker logic here
    if (source === 'camera') {
      console.log('Camera selected');
      try {
        const res = await ImagePicker.launchCameraAsync()
        if (!res.canceled && res.assets.length > 0) {
          const uri = res.assets[0].uri;
          setImage(uri);
          console.log("image: ", image); }
          //   const formdata = new FormData();
          //   formdata.append('file', { 
          //   uri: avatarUri, 
          //   name: 'image', 
          //   type: 'image/jpeg' });
          //   const responseFromServer = await axios.post(`${config.serverAddress}/file`,
          //   formdata,
          //   { headers: { 'Content-Type': 'multipart/form-data' } }
          // );
          // console.log(responseFromServer);
      } catch (error) { console.error('Failed to open camera', error); }
    } else {
      console.log('Gallery selected');
      try {
        const res = await ImagePicker.launchImageLibraryAsync()
        if (!res.canceled && res.assets.length > 0) {
          const uri = res.assets[0].uri;
          setImage(uri);
        }

      } catch (error) { console.error('Failed to open gallery', error); }
    }
  };

  const handlePhotoSubmuit = async () => {
    try {
    if (image.length > 0) {
      console.log('Submitting photo: ', image);
      await PhotoAPI.submitPhoto(image)
    }
    else { alert('Please select a photo') }
  } catch (error) { console.error('Failed to submit photo', error); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <View>
        {image == "" && <Image source={require('../assests/avagreen.png')} style={styles.avatar} />}
        {image != "" && <Image source={{ uri: image }} style={styles.avatar} />}
        <TouchableOpacity onPress={() => pickImage('camera')}>
          <Ionicons name={'camera'} style={styles.cameraButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => pickImage('gallery')}>
          <Ionicons name={'image'} style={styles.galleryButton} />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (<Button title="Register" onPress={handleUserRegistration} />)}
      <Button title="Submit Photo" onPress={handlePhotoSubmuit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 50,
  },
  cameraButton: {
    fontSize: 35,
    color: 'black',
    position: 'absolute',
    bottom: 15,
    right: -25,
  },
  galleryButton: {
    fontSize: 35,
    color: 'black',
    position: 'absolute',
    bottom: 15,
    right: 90,
  },
});

export default RegistrationScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import config from './../core/config';

const RegistrationScreen: React.FC = () => {

  // User input state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessToken, setAccessToken] = useState('');

  // Student input state
  const [name, setName] = useState('');
  const [age, setAge] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleUserRegistration = async () => {
    setIsLoading(true);
    if (email === '' || password === '') {
      Alert.alert('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters');
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
        } else { alert("Login failed: Network error or server is down");}
      } else {
        // Error is not an AxiosError, handle it differently
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    }
  finally { setIsLoading(false); }
  };

  const extractIdFromResponse = (response: string ): string => {
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
    getAccessToken();
    console.log("Access token: ", accessToken);
    try {
      const responseFromServer = await axios.post(`${config.serverAddress}/student`,
        { _id, name, age },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (responseFromServer.status === 201) {
        console.log("Student: Register successful");
        alert("Register successful");
        // Clear the input fields
        setEmail('');
        setPassword('');
        setName('');
        setAge('');
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
      />
      {isLoading ? (
        <ActivityIndicator size="large" /> // Display the loading indicator
      ) : ( <Button title="Register" onPress={handleUserRegistration} /> )}
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
});

export default RegistrationScreen;

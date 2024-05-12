import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import axios from 'axios';
import config from './../core/config';

const RegistrationScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegistration = async () => {
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
        console.log("Register successful");
        alert("Register successful");
        setEmail('');
        setPassword('');
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
          // alert(`Login failed: ${error.response.data.message}`);
          alert("Login failed: user already exists");
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
      <Button title="Register" onPress={handleRegistration} />
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

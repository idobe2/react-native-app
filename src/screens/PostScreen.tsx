import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView } from 'react-native';
import { RouteProp } from "@react-navigation/native";
import axios from "axios";
import config from "../core/config";

type PostRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface PostProps {
  route: PostRouteProp;
}
const Post: React.FC<PostProps> = ({ route }) => {
  const { user } = route.params;
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    // Implement the submit logic, perhaps sending data to a backend or storing locally
    console.log({ title, message });

    try {
      const responseFromServer = await axios.post(
        `${config.serverAddress}/post`,
        { title, message },
        {
          headers: {
            // Include the Authorization header with the token
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      console.log("user" , user.accessToken);
      if (responseFromServer.status === 201) {
        console.log("Post created successfully");
      }
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
    }
    alert('Post submitted!');
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
      <Button title="Submit Post" onPress={handleSubmit} />
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
});

export default Post;

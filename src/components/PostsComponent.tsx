import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import axios from "axios";
import config from "../core/config";
import { useFocusEffect } from "@react-navigation/native";

interface Post {
  _id: string;
  title: string;
  category: string;
  message: string;
  image: string;
  owner: string;
}

interface PostsComponentProps {
  fetchUrl: string;  // Prop to specify the URL for fetching posts
}

const PostsComponent: React.FC<PostsComponentProps> = ({ fetchUrl }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const maxRetries = 3;
  let retryCount = 0;

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get<Post[]>(`${config.serverAddress}${fetchUrl}`);
          setPosts(response.data);
          setLoading(false);
          retryCount = 0; // reset retries on success
          console.log("Posts loaded successfully");
        } catch (error: unknown) {
          setLoading(false);
          if (retryCount < maxRetries) {
            retryCount++;
            setPosts([]); // clear posts
            console.log(`Retry ${retryCount}`);
            fetchPosts(); // retry fetching
          }
          if (axios.isAxiosError(error)) {
            if (error.response) {
              console.log("There no posts: ", error.response.status);
            } else {
              alert("Network error or server is down");
            }
          } else {
            // Error is not an AxiosError, handle it differently
            console.log("An unexpected error occurred:", error);
            alert("An unexpected error occurred");
          }
          setLoading(false);
        }
      };

      fetchPosts();
      return () => {};  // Cleanup placeholder
    }, [fetchUrl])
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading Posts...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={item => item._id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  postContainer: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PostsComponent;

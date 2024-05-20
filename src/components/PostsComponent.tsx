import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, Image, RefreshControl  } from "react-native";
import axios from "axios";
import config from "../core/config";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";

interface Post {
  _id: string;
  title: string;
  category: string;
  message: string;
  image: string;
  owner: string;
  price: number;
  date: string; // Assuming date is a string
}

interface PostsComponentProps {
  fetchUrl: string;
}

const PostsComponent: React.FC<PostsComponentProps> = ({ fetchUrl }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const maxRetries = 3;
  let retryCount = 0;

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          const response = await axios.get<Post[]>(`${config.serverAddress}${fetchUrl}`);
          setPosts(response.data);
          console.log("Posts loaded successfully");
          setLoading(false);
          retryCount = 0; // reset retries on success
        } catch (error: unknown) {
          setLoading(false);
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retry ${retryCount}`);
            setPosts([]); // clear posts on retry
            fetchPosts(); // retry fetching
          } else {
            console.log("Failed to fetch posts after retries");
          }
        }
      };

      fetchPosts();
      return () => {};
    }, [fetchUrl])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    axios.get<Post[]>(`${config.serverAddress}${fetchUrl}`)
      .then(response => {
        setPosts(response.data);
        setRefreshing(false);
      })
      .catch(() => {
        setRefreshing(false);
      });
  }, [fetchUrl]);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.category}>Category: {item.category}</Text>
      <Text>Price: {item.price}₪</Text>
      <Text>{item.message}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text style={styles.date}>Posted {moment(item.date).fromNow()}</Text>
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    padding: 20,
    marginVertical: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
});

export default PostsComponent;

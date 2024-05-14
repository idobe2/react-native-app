import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { RouteProp, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import config from "./../core/config";

type HomeRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface HomeProps {
  route: HomeRouteProp;
}

interface Post {
  _id: string;
  title: string;
  message: string;
  owner: string;
}

const Home: React.FC<HomeProps> = ({ route }) => {
  const { user } = route.params;
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        try {
          const response = await axios.get<Post[]>(`${config.serverAddress}/post`);
          setPosts(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Failed to fetch posts", error);
          setLoading(false);
        }
      };

      fetchPosts();

      // Cleanup function, no specific cleanup needed here
      return () => {};
    }, [])
  );

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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

export default Home;

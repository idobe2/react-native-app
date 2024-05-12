import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { RouteProp } from "@react-navigation/native";
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log(user.accessToken);
        const response = await axios.get<Post[]>(`${config.serverAddress}/post`);
        setPosts(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>User Info:</Text>
      <Text></Text>
      <Text>accessToken: {user.accessToken}</Text>
      <Text></Text>
      <Text>refreshToken: {user.refreshToken}</Text>
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

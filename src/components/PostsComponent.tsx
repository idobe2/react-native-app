import React, { useState, useCallback } from "react";
import { Alert, View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity } from "react-native";
import axios from "axios";
import config from "../core/config";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { Facebook } from 'react-content-loader/native';
import StudentAPI from '../api/student-api';
import PostAPI from '../api/post-api';

interface Post {
  _id: string;
  title: string;
  category: string;
  message: string;
  image: string;
  owner: string;
  price: number;
  date: string;
  user?: User;
}

interface User {
  _id: string;
  name: string;
  image: string;
}

interface PostsComponentProps {
  fetchUrl: string;
}

const PostsComponent: React.FC<PostsComponentProps> = ({ fetchUrl }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<boolean>(false);
  const maxRetries = 3;
  let retryCount = 0;

  useFocusEffect(
    useCallback(() => {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          const response = await axios.get<Post[]>(`${config.serverAddress}${fetchUrl}`);
          const postsWithUsers = await Promise.all(response.data.map(async post => {
            const user = await StudentAPI.getStudentById(post.owner);
            return { ...post, user };
          }));
          setPosts(postsWithUsers);
          console.log("Posts loaded successfully");
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
        } finally {
          setTimeout(() => {
            setLoading(false);
          }, 1500);
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

  const handleDelete = async (postId: string) => {
    const res = await PostAPI.deletePost(postId);
    if (res && res.status === 200) {
      console.log("Post deleted successfully");
      setPosts(posts.filter(post => post._id !== postId));
    } else {
      console.log("Failed to delete post");
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleCategory}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        {item.user && (
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Image source={{ uri: item.user.image }} style={styles.userImage} />
          </View>
        )}
      </View>
      <Text>{item.price}₪</Text>
      <Text>{item.message}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text style={styles.date}>Posted {moment(item.date).fromNow()}</Text>
      {fetchUrl.includes(`/post/find/${item.owner}`) && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => 
          Alert.alert("Are you sure you want to delete this post?", "This action cannot be undone", [
          { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
          { text: "Delete", onPress: () => handleDelete(item._id) }
        ])}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loaderContainer}>
          <View style={styles.loader}><Facebook /></View>
          <View style={styles.loader}><Facebook /></View>
          <View style={styles.loader}><Facebook /></View>
        </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10, // Space between user info and post title
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: -10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 10,
    marginRight: 10,
  },
  titleCategory: {
    flex: 1, // Take the remaining space
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  category: {
    fontSize: 16,
    color: '#666',
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  loader: {
    margin: 50,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PostsComponent;

import React, { useState, useCallback, useContext } from "react";
import { Alert, View, Text, StyleSheet, FlatList, Image, RefreshControl, TouchableOpacity, Modal, TextInput, Button } from "react-native";
import axios from "axios";
import config from "../core/config";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { Facebook } from 'react-content-loader/native';
import StudentAPI from '../api/student-api';
import PostAPI from '../api/post-api';
import themeContext from "../theme/themeContext";
import { Picker } from '@react-native-picker/picker';

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
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedCategory, setEditedCategory] = useState('');
  const [editedPrice, setEditedPrice] = useState<string>("");
  const [editedMessage, setEditedMessage] = useState<string>("");
  
  const theme = useContext(themeContext) as any;
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

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axios.get<Post[]>(`${config.serverAddress}${fetchUrl}`);
      const postsWithUsers = await Promise.all(response.data.map(async post => {
        const user = await StudentAPI.getStudentById(post.owner);
        return { ...post, user };
      }));
      setPosts(postsWithUsers);
      console.log("Posts refreshed successfully");
    } catch (error: unknown) {
      console.log("Failed to refresh posts");
    } finally {
      setRefreshing(false);
    }
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

  const handleEdit = (post: Post) => {
    setCurrentPost(post);
    setEditedTitle(post.title);
    setEditedCategory(post.category);
    setEditedPrice(post.price.toString());
    setEditedMessage(post.message);
    setModalVisible(true);
  };

  const saveEdit = async () => {
    console.log("Save edit", editedTitle, editedMessage);
    if (currentPost) {
      const updatedPost = { ...currentPost, title: editedTitle, category: editedCategory, price: Number(editedPrice), message: editedMessage };
      const res = await PostAPI.updatePost(updatedPost);
      if (res && res.status === 200) {
        setPosts(posts.map(post => (post._id === currentPost._id ? updatedPost : post)));
        console.log("Post updated successfully");
        setModalVisible(false);
      } else {
        console.log("Failed to update post");
      }
    }
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View style={[styles.postContainer, {backgroundColor:theme.backgroundColor}]}>
      <View style={styles.headerRow}>
        <View style={styles.titleCategory}>
          <Text style={[styles.title, {color:theme.color}]}>{item.title}</Text>
          <Text style={styles.category}>{item.category}</Text>
        </View>
        {item.user && (
          <View style={styles.userInfo}>
            <Text style={[styles.userName, {color:theme.color}]}>{item.user.name}</Text>
            <Image source={{ uri: item.user.image }} style={styles.userImage} />
          </View>
        )}
      </View>
      <Text style={[styles.text, {color:theme.color}]}>{item.price}₪</Text>
      <Text style={[styles.text, {color:theme.color}]}>{item.message}</Text>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <Text style={styles.date}>Posted {moment(item.date).fromNow()}</Text>
      {fetchUrl.includes(`/post/find/${item.owner}`) && (
        <View>
          <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() =>
            Alert.alert("Are you sure you want to delete this post?", "This action cannot be undone", [
              { text: "Cancel", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
              { text: "Delete", onPress: () => handleDelete(item._id) }
            ])
          }>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>
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
      {currentPost && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Edit Post</Text>
            <TextInput
              style={styles.input}
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Title"
            />
            <Picker
            style={[styles.input, {color:theme.color}]}
            selectedValue={editedCategory}
            onValueChange={setEditedCategory}
            >
            <Picker.Item label="Books" value="books" />
            <Picker.Item label="Clothing" value="clothes" />
            <Picker.Item label="Home decor and furniture" value="home" />
            <Picker.Item label="Videogames" value="videogames" />
            <Picker.Item label="Consumer electronics" value="electronics" />
            <Picker.Item label="Smartphones" value="smartphones" />
            <Picker.Item label="Computers" value="computers" />
            </Picker>
            <TextInput
              style={styles.input}
              value={editedPrice}
              onChangeText={setEditedPrice}
              placeholder="Price [₪]"
            />
            <TextInput
              style={styles.inputMessage}
              value={editedMessage}
              onChangeText={setEditedMessage}
              placeholder="Message"
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
              <Button title="Save" onPress={saveEdit} />
            </View>
          </View>
        </Modal>
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
    borderWidth: 2.5,
    borderColor: 'yellow',
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
  text:{
    fontSize: 14,
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
  editButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  inputMessage: {
    width: '100%',
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default PostsComponent;

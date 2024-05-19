import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Image, TextInput, Button } from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import config from "../core/config";
import { RouteProp } from "@react-navigation/native";
import PostsComponent from "../components/PostsComponent";

interface UserInfo {
  _id: string;
  name: string;
  age: number;
  image: string;
}

type ProfileRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface ProfileProps {
  route: ProfileRouteProp;
}

const Profile: React.FC<ProfileProps> = ({ route }) => {
  const { user } = route.params;
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [changesMade, setChangesMade] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchUserInfo = async () => {
        try {
          const responseFromServer = await axios.get<UserInfo>(
            `${config.serverAddress}/student/${user.accessToken}`,
            {
              headers: {
                Authorization: `Bearer ${user.accessToken}`,
              },
            }
          );
          if (responseFromServer.status === 200) {
            console.log("Profile loaded successfully");
            setUserInfo(responseFromServer.data);
            setName(responseFromServer.data.name);
            setAge(responseFromServer.data.age.toString());
          }
        } catch (error: unknown) {
          console.error("Profile loading failed with error: ", error);
        }
      };

      fetchUserInfo();
    }, [user._id, user.accessToken])
  );

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    // Implement save functionality here
    console.log("Saving", { name, age });
    setEditMode(false);
    setChangesMade(false);
  };

  const handleInputChange = (newValue: string, field: 'name' | 'age') => {
    setChangesMade(true);
    if (field === 'name') {
      setName(newValue);
    } else {
      setAge(newValue);
    }
  };

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userInfo.image }}
        style={styles.image}
      />
      <View style={styles.row}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          value={name}
          onChangeText={(text) => handleInputChange(text, 'name')}
          style={[styles.input, !editMode && styles.inputDisabled]}
          editable={editMode}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Age:</Text>
        <TextInput
          value={age}
          onChangeText={(text) => handleInputChange(text, 'age')}
          style={[styles.input, !editMode && styles.inputDisabled]}
          editable={editMode}
          keyboardType="numeric"
        />
      </View>
      {!editMode && <Button title="Edit Profile" onPress={handleEdit} />}
      {changesMade && <Button title="Save Changes" onPress={handleSave} />}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PostsComponent fetchUrl={`/post/find/${userInfo?._id}`} />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 5,
    flex: 1,
    marginBottom: 10,
  },
  inputDisabled: {
    backgroundColor: '#f0f0f0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
  },
  label: {
    height: 30,
    width: 50,
    marginRight: 10,
    fontSize: 16,
  }
});

export default Profile;

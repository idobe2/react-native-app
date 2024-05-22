import React, {useContext} from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../theme/themeContext";

interface ProfileViewProps {
  name: string;
  age: string;
  image: string;
  onEdit: () => void;
  onImagePick: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ name, age, image, onEdit, onImagePick }) => {
  const theme = useContext(themeContext) as any;
  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  return (
    <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>
      <TouchableOpacity onPress={onImagePick} style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Image source={require('../assests/avagreen.png')} style={styles.image} />
        )}
        <Ionicons name="pencil" size={24} color="black" style={[styles.editIcon, {color:theme.color}]} />
      </TouchableOpacity>
      <Text style={[styles.text, {color:theme.color}]}>Name: {name}</Text>
      <Text style={[styles.text, {color:theme.color}]}>Age: {age}</Text>
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginBottom: -20,
    marginVertical: 10,
  },
  editIcon: {
    position: 'absolute',
    right: -25,
    marginBottom: -20,
    bottom: 0,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  editButton: {
    marginBottom: 5,
    padding: 5,
    backgroundColor: 'blue',
    borderRadius: 10,
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProfileView;
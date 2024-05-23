import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const buttonTextColor = theme.backgroundColor === '#000000' ? '#FFFFFF' : '#000000';
  const buttonBackgroundColor = theme.backgroundColor === '#000000' ? '#000000' : '#FFFFFF';

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={onImagePick} style={styles.imageButton}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Image source={require('../assests/avagreen.png')} style={styles.image} />
          )}
          <Ionicons name="pencil" size={24} style={[styles.editIcon, { color: buttonTextColor }]} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.text, { color: theme.color }]}>Name: {name}</Text>
      <Text style={[styles.text, { color: theme.color }]}>Age: {age}</Text>
      <TouchableOpacity onPress={onEdit} style={[styles.editButton, { backgroundColor: buttonBackgroundColor }]}>
        <Text style={[styles.editButtonText, { color: buttonTextColor }]}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButton: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: -10,
    marginBottom: -15,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: -20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  editButton: {
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileView;

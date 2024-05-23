import React from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface ProfileEditProps {
  name: string;
  age: string;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (newValue: string, field: 'name' | 'age') => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ name, age, onSave, onCancel, onInputChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        value={name}
        onChangeText={(text) => onInputChange(text, 'name')}
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="grey"
      />
      <TextInput
        value={age}
        onChangeText={(text) => onInputChange(text, 'age')}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Age"
        placeholderTextColor="grey"
      />
      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={onSave}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
        <Text style={styles.buttonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    marginBottom: 12,
    color: '#000',
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  cancelButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ProfileEdit;

// ProfileEdit.tsx
import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface ProfileEditProps {
  name: string;
  age: string;
  image: string;
  onSave: () => void;
  onCancel: () => void;
  onInputChange: (newValue: string, field: 'name' | 'age') => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ name, age, onSave, onCancel, onInputChange }) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={(text) => onInputChange(text, 'name')}
        style={styles.input}
        placeholder="Name"
      />
      <TextInput
        value={age}
        onChangeText={(text) => onInputChange(text, 'age')}
        style={styles.input}
        keyboardType="numeric"
        placeholder="Age"
      />
      <Button title="Save Changes" onPress={onSave} />
      <Button title="Cancel" onPress={onCancel} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    width: '90%',
    marginBottom: 12,
  },
});

export default ProfileEdit;

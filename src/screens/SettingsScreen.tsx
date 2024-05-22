import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Button, Alert, Switch, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../App";
import { EventRegister } from "react-native-event-listeners";
import themeContext from "../theme/themeContext";

type SettingsRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface SettingsProps {
  route: SettingsRouteProp;
  navigation: StackNavigationProp<RootStackParamList>;
}

const Settings: React.FC<SettingsProps> = ({ route, navigation }) => {
  const { user } = route.params;
  const theme = useContext(themeContext) as any;
  const [darkMode, setDarkMode] = React.useState<boolean>(false);

  const handleLogout = async () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          onPress: async () => {
            await AsyncStorage.removeItem("@user");
            navigation.replace("SignIn");
          },
        },
      ]
    );
  };


  const handleDeleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => console.log("Account deleted") }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* <View style={styles.profileSection}>
        <Text style={[styles.profileText, { color: theme.color }]}>
          {user.name}
        </Text>
        <Text style={[styles.profileEmail, { color: theme.color }]}>
          {user.email}
        </Text>
      </View> */}
      {/* <Text>User Info:</Text> */}
      {/* <Text>{JSON.stringify(user, null, 2)}</Text> */}
      <View style={styles.settingsSection}>
        <Text style={[styles.sectionTitle, { color: theme.color }]}>
          Preferences
        </Text>
        <View style={styles.settingItem}>
          <Text style={[styles.settingText, { color: theme.color }]}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={(value) => {
              setDarkMode(value);
              EventRegister.emit("ChangeTheme", value);
            }}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDeleteAccount}>
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 18,
    color: "gray",
  },
  settingsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingText: {
    fontSize: 16,
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#007bff",
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Settings;

import React from "react";
import { View, Text, StyleSheet, Button, Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootStackParamList } from "../../App";

type SettingsRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface SettingsProps {
  route: SettingsRouteProp;
  navigation: StackNavigationProp<RootStackParamList>;
}
const Settings: React.FC<SettingsProps> = ({ route, navigation }) => {
  const { user } = route.params;

  const handleLogout = async () => {
    await AsyncStorage.removeItem("@user");
    Alert.alert("Logged out successfully");
    navigation.replace("SignIn");
  };

  return (
    <View style={styles.container}>
      <Button title="Log Out" onPress={handleLogout} />
      <Text>User Info:</Text>
      <Text>{JSON.stringify(user, null, 2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Settings;
import React, {useState, useContext} from "react";
import { View, Text, StyleSheet, Button, Alert, Switch } from "react-native";
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
    await AsyncStorage.removeItem("@user");
    Alert.alert("Logged out successfully");
    navigation.replace("SignIn");
  };

  return (
    <View style={[styles.container, {backgroundColor:theme.backgroundColor}]}>
      <Button title="Log Out" onPress={handleLogout} />
      <Text style={[styles.text, {color:theme.color}]}>{'\n\n'}Dark Mode:{'\n'}</Text>
      <Switch
        value={darkMode}
        onValueChange={(value) => {
          setDarkMode(value) 
          EventRegister.emit("ChangeTheme", value);
        }}
      />
      {/* <Text>User Info:</Text> */}
      {/* <Text>{JSON.stringify(user, null, 2)}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});

export default Settings;
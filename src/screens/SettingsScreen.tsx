import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { RouteProp } from "@react-navigation/native";

type SettingsRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface SettingsProps {
  route: SettingsRouteProp;
}
const Settings: React.FC<SettingsProps> = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>User Info:</Text>
      <Text>{JSON.stringify(user, null, 2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Settings;

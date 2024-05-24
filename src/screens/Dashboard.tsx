import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "./HomeScreen";
import Settings from "./SettingsScreen";
import Post from "./PostScreen";
import Profile from "./ProfileScreen";
import Categories from "./CategoriesScreen";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";

type DashboardRouteProp = RouteProp<{ params: { user: any } }, "params">;

const Tab = createBottomTabNavigator();

interface DashboardProps {
  route: DashboardRouteProp;
}
const Dashboard: React.FC<DashboardProps> = ({ route }) => {
  const { user } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName:
            | "home"
            | "home-outline"
            | "person"
            | "person-outline"
            | "alert-circle-outline"
            | "add-circle"
            | "add-circle-outline"
            | "settings"
            | "settings-outline"
            | "grid"
            | "grid-outline";
          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Post") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Categories") {
            iconName = focused ? "grid" : "grid-outline";
          } else {
            iconName = "alert-circle-outline"; // Default icon to ensure iconName is always defined
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#e91e63",
        tabBarInactiveTintColor: "orange",
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home as React.FC<{}>}
        initialParams={{ user: user }}
      />
      <Tab.Screen
        name="Categories"
        component={Categories as React.FC<{}>}
      />
      <Tab.Screen
        name="Post"
        component={Post as React.FC<{}>}
        initialParams={{ user: user }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile as React.FC<{}>}
        initialParams={{ user: user }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings as React.FC<{}>}
        initialParams={{ user: user }}
      />
    </Tab.Navigator>
  );
};

export default Dashboard;

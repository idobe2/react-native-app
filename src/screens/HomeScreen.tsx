import React from "react";
import { View } from "react-native";
import PostsComponent from "../components/PostsComponent";  // Adjust the path as necessary
import { RouteProp } from "@react-navigation/native";

type HomeRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface HomeProps {
  route: HomeRouteProp;
}

const Home: React.FC<HomeProps> = ({ route }) => {
  const { user } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PostsComponent fetchUrl="/post" />
    </View>
  );
};

export default Home;

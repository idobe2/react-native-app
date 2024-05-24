import React, { useCallback } from "react";
import { View } from "react-native";
import PostsComponent from "../components/PostsComponent"; // Adjust the path as necessary
import { RouteProp, useFocusEffect } from "@react-navigation/native";

type HomeRouteProp = RouteProp<{ params: { user: any } }, "params">;

interface HomeProps {
  route: HomeRouteProp;
}

const Home: React.FC<HomeProps> = ({ route }) => {
  const { user } = route.params;
  const [refreshKey, setRefreshKey] = React.useState(0);

  useFocusEffect(
    useCallback(() => {
      setRefreshKey(prevKey => prevKey + 1);
    }, [])
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PostsComponent key={refreshKey} fetchUrl="/post" />
    </View>
  );
};

export default Home;

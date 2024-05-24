import React, { useState, useContext } from "react";
import { View } from "react-native";
import themeContext from "../theme/themeContext";
import PostsComponent from "../components/PostsComponent";
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";

type CategoryPostsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "CategoryPosts"
>;

interface CategoryPostsProps {
  navigation: CategoryPostsScreenNavigationProp;
  route: {
    params: {
      categoryId: string;
    };
  };
}

const CategoryPostsScreen: React.FC<CategoryPostsProps> = ({ route }) => {
  const { categoryId } = route.params;
  const theme = useContext(themeContext) as any;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PostsComponent fetchUrl={`/post/get/${categoryId}`} />
    </View>
  );
};

export default CategoryPostsScreen;

import React, {useContext} from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { RootStackParamList } from "../../App";
import { StackNavigationProp } from "@react-navigation/stack";
import themeContext from "../theme/themeContext";

const categories = [
  { id: "books", title: "Books", icon: "📚" },
  { id: "clothes", title: "Clothes", icon: "👚" },
  { id: "home", title: "Home Decor", icon: "🏠" },
  { id: "videogames", title: "Videogames", icon: "🎮" },
  { id: "electronics", title: "Electronics", icon: "📺" },
  { id: "smartphones", title: "Smartphones", icon: "📱" },
  { id: "computers", title: "Computers", icon: "💻" },
  { id: "other", title: "Other", icon: "🛒"}
];

interface CategoriesProps {
    navigation: StackNavigationProp<RootStackParamList>;
  }

const CategoriesScreen: React.FC<CategoriesProps> = ({ navigation }) => {
  const theme = useContext(themeContext) as any;

  const renderItem = ({ item }: { item: { id: string; title: string; icon: string } }) => (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      onPress={() => navigation.navigate("CategoryPosts", { categoryId: item.id })}
    >
      <Text style={[styles.icon, { color: theme.color }]}>{item.icon}</Text>
      <Text style={[styles.title, { color: theme.color }]}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  grid: {
    justifyContent: "space-between",
  },
  categoryContainer: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
    left: 45
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CategoriesScreen;

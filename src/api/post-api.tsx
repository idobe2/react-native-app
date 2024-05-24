import axios from "axios";
import config from "../core/config";

const addPost = async (post: any, accessToken: string) => {
  try {
    const response = await axios.post(`${config.serverAddress}/post`, post, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.status === 201) {
      console.log("Post added successfully");
    } else {
      console.log("Failed to add post: ", response.status);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Failed to add post: ", error.message);
      if (error.response) {
        console.log("Error status: ", error.response.status);
      } else {
        console.log("Add failed: Network error or server is down");
      }
    } else {
      console.log("An unexpected error occurred:", error);
    }
  }
};

const deletePost = async (postId: string) => {
  try {
    const response = await axios.delete(
      `${config.serverAddress}/post/delete/${postId}`
    );
    if (response.status === 200) {
      console.log("Post deleted successfully");
    } else {
      console.log("Failed to delete post: ", response.status);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Failed to delete post: ", error.message);
      if (error.response) {
        console.log("Error status: ", error.response.status);
      } else {
        console.log("Delete failed: Network error or server is down");
      }
    } else {
      console.log("An unexpected error occurred:", error);
    }
  }
};

const updatePost = async (post: any) => {
  try {
    const response = await axios.put(
      `${config.serverAddress}/post/${post._id}`,
      post
    );
    if (response.status === 200) {
      console.log("Post updated successfully");
    } else {
      console.log("Failed to update post: ", response.status);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Failed to update post: ", error.message);
      if (error.response) {
        console.log("Error status: ", error.response.status);
      } else {
        console.log("Update failed: Network error or server is down");
      }
    } else {
      console.log("An unexpected error occurred:", error);
    }
  }
};

const getAllUserPosts = async (owner: string) => {
  try {
    const response = await axios.get(
      `${config.serverAddress}/post/find/${owner}`
    );
    if (response.status === 200) {
      console.log("Posts fetched successfully");
    } else {
      console.log("Failed to fetch posts: ", response.status);
    }
    return response;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Failed to fetch posts: ", error.message);
      if (error.response) {
        console.log("Error status: ", error.response.status);
      } else {
        console.log("Fetch failed: Network error or server is down");
      }
    } else {
      console.log("An unexpected error occurred:", error);
    }
  }
}

export default { deletePost, updatePost, addPost, getAllUserPosts };

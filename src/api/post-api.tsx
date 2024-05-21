import axios from 'axios';
import config from '../core/config';

const deletePost = async (postId: string) => {
    try {
        const response = await axios.delete(`${config.serverAddress}/post/delete/${postId}`);
        if (response.status === 200) {
            console.log("Post deleted successfully");
        }
        else { console.log("Failed to delete post: ", response.status); }
        return response;
    }
    catch (error: unknown) {
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
}

export default { deletePost };
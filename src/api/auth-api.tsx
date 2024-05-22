import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../core/config";

const getUserInfo = async (token: any) => {
  if (!token) return;
  try {
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      }
    );
    const userInfoJson = await userInfoResponse.json();
    await AsyncStorage.setItem("@user", JSON.stringify(userInfoJson));
    return userInfoJson;
  } catch (error) {
    console.error("Failed to fetch user info:", error);
  }
};

const extractIdFromResponse = (response: string): string => {
    try {
      const parsedResponse = JSON.parse(response);
      console.log("id: ", parsedResponse._id);
      return parsedResponse._id; // Access the _id field
    } catch (error) {
      console.error("Failed to parse JSON", error);
      return ""; // Return an empty string or handle the error as needed
    }
  };

  const googleSingIn = async (audience: string, idToken: string) => {
    // console.log("googleSignIn:\nandroidClientId: ", audience, "\ntoken: ", idToken);
    const data = {
      credentialResponse: idToken,
      audience: config.androidClientId,
    }
    try {
      const responseFromServer = await axios.post(`${config.serverAddress}/auth/google`,
         data 
      );
      if (responseFromServer.status === 200) {
        console.log("User submited successfully");
        // console.log("responseFromServer: ", responseFromServer.data);
        return responseFromServer.data;
      }
      else { console.log("Failed to submit user: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to submit user: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
        } else {
          console.log("Submit failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  }

  const refreshTokens = async (refreshToken: string) => {
    console.log("Refresh token: ", refreshToken);
    try {
      const responseFromServer = await axios.get(`${config.serverAddress}/auth/refresh`,
      {
        headers: { 'Authorization': `Bearer ${refreshToken}` },
      }
      );
      if (responseFromServer.status === 200) {
        console.log("New tokens received successfully");
        console.log("responseFromServer: ", responseFromServer.data);
        return responseFromServer.data;
      }
      else { console.log("Failed to recieve tokens: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to recieve tokens: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
        } else {
          console.log("Recieve failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  }

  const registerUser = async (email: string, password: string) => {
    try {
      const responseFromServer = await axios.post(
        `${config.serverAddress}/auth/register`,
        { email, password }
      );
      if (responseFromServer.status === 200) {
        console.log("User: Register successful");
        return responseFromServer;
      } else { console.log("Login failed with status: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Login failed with error: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
          alert("Login failed: user already exists");
        } else { alert("Login failed: Network error or server is down"); }
      } else {
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    }
  }

  const getAccessToken = async (email: string, password: string) => {
    try {
      const responseFromServer = await axios.post(
        `${config.serverAddress}/auth/login`,
        { email, password }
      );
      if (responseFromServer.status === 200) {
        console.log("Access token: ", responseFromServer.data.accessToken);
        return responseFromServer.data.accessToken;
      } else {
        console.log("Login failed with status: ", responseFromServer.status);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Login failed with error: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
          alert(`Login failed: ${error.response.data.message}`);
        } else {
          alert("Login failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const responseFromServer = await axios.post(
        `${config.serverAddress}/auth/login`,
        { email, password }
      );
      if (responseFromServer.status === 200) {
        console.log("Login successful");
        alert("Login successful");
        await AsyncStorage.setItem("@user", JSON.stringify(responseFromServer.data));
        return responseFromServer.data;
      } else {
        console.log("Login failed with status: ", responseFromServer.status);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Login failed with error: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
          alert(`Login failed: ${error.response.data.message}`);
        } else {
          alert("Login failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    }
  }

  export default { 
    extractIdFromResponse,
    getUserInfo,
    googleSingIn,
    refreshTokens,
    registerUser,
    getAccessToken,
    signIn
  }
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import config from "../core/config";

const getUserInfo = async (token: string) => {
  if (!token) return;
  try {
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const userInfoJson = await userInfoResponse.json();
    await AsyncStorage.setItem("@user", JSON.stringify(userInfoJson));
    const getUserInfo = async (token: string) => {
      if (!token) return;
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/userinfo/v2/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userInfoJson = await userInfoResponse.json();
        // await AsyncStorage.setItem("@user", JSON.stringify(userInfoJson));
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
      console.log('userInfoJson: ', userInfoJson);
      
      return userInfoJson;
    };
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
    console.log("androidClientId: ", audience, "token: ", idToken);
    console.log(`${config.serverAddress}/auth/google`);
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
        console.log("responseFromServer: ", responseFromServer.data);
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

  export default { 
    extractIdFromResponse,
    getUserInfo,
    googleSingIn
  }
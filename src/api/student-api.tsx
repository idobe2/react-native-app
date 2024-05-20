import apiClient from './client-api'
import axios from 'axios';
import config from '../core/config';
import PhotoAPI from './photo-api';

const getAllStudents = async () => {
    return apiClient.get("/student");
};

const uploadImage = async (image: any) => {
    return apiClient.post("/file/file", image);
}

const deleteStudent = async (accessToken: string, _id?: string) => {
    try {
      const responseFromServer = await axios.delete(`${config.serverAddress}/student/${_id}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (responseFromServer.status === 200) {
        console.log("Student deleted successfully");
      }
      else { console.log("Failed to delete student: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to delete student: ", error.message);
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

const submitStudent = async (userInfo: any, accessToken: string) => {
    const res = await PhotoAPI.submitPhoto(userInfo.image);
    console.log("Photo submitted", res);
    try {
      const responseFromServer = await axios.post(`${config.serverAddress}/student`,
        { _id: userInfo._id, name: userInfo.name, age: userInfo.age, image: res },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (responseFromServer.status === 201) {
        console.log("Student submited successfully");
      }
      else { console.log("Failed to submit student: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to submit student: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
        } else {
          console.log("Submit failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

export default {
    getAllStudents,
    uploadImage,
    submitStudent,
    deleteStudent
}
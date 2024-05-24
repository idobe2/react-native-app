import apiClient from './client-api'
import axios from 'axios';
import config from '../core/config';
import PhotoAPI from './photo-api';

const getAllStudents = async () => {
    return apiClient.get("/student");
};

const getStudent = async (accessToken: string) => {
    try {
      const responseFromServer = await axios.get(`${config.serverAddress}/student/${accessToken}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (responseFromServer.status === 200) {
        console.log("Student loaded successfully");
        return responseFromServer.data;
      }
      else { console.log("Failed to load student: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to load student: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
        } else {
          console.log("Load failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
    return null;
}

const getStudentById = async (id: string) => {
  try {
    const responseFromServer = await axios.get(`${config.serverAddress}/student/get/${id}`);
    if (responseFromServer.status === 200) {
      console.log("Student get successfully");
      return responseFromServer.data;
    }
    else { console.log("Failed to get student: ", responseFromServer.status); }
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Failed to get student: ", error.message);
      if (error.response) {
        console.log("Error status: ", error.response.status);
      } else {
        console.log("Load failed: Network error or server is down");
      }
    } else {
      console.log("An unexpected error occurred:", error);
    }
  }
  return null;
}

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

const addStudent = async (student: any, accessToken: string) => {
    try {
      const responseFromServer = await axios.post(`${config.serverAddress}/student`,
        student,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (responseFromServer.status === 201) {
        console.log("Student added successfully");
        return responseFromServer.data;
      }
      else { console.log("Failed to add student: ", responseFromServer.status); }
    }
    catch (error: unknown) {
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

const updateStudent = async (student: any, accessToken: string) => {
    try {
      const responseFromServer = await axios.put(`${config.serverAddress}/student/${student._id}`,
        student,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (responseFromServer.status === 200) {
        console.log("Student updated successfully");
        return responseFromServer.data;
      }
      else { console.log("Failed to update student: ", responseFromServer.status); }
    }
    catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Failed to update student: ", error.message);
        if (error.response) {
          console.log("Error status: ", error.response.status);
          alert(`Update failed: ${error.response.data.message}`);
        } else {
          alert("Update failed: Network error or server is down");
        }
      } else {
        console.log("An unexpected error occurred:", error);
        alert("An unexpected error occurred");
      }
    }
  }

export default {
    getAllStudents,
    uploadImage,
    submitStudent,
    deleteStudent,
    getStudent,
    getStudentById,
    addStudent,
    updateStudent
}

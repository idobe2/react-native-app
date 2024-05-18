import apiClient from './client-api'

const getAllStudents = async () => {
    return apiClient.get("/student");
};

const uploadImage = async (image: any) => {
    return apiClient.post("/file/file", image);
}


export default {
    getAllStudents,
    uploadImage
}

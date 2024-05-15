import apiClient from './client-api'

const getAllStudents = async () => {
    return apiClient.get("/student");
};

export default {
    getAllStudents,
}

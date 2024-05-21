import axios from "axios";
import config from "../core/config";

const apiClient = axios.create({
    baseURL: config.serverAddress,
    headers: {Accept: 'application/vnd.github.v3+json'}
})

export default apiClient;
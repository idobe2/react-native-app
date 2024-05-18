import axios from "axios";
import FormData from 'form-data';
import config from "../core/config";

const submitPhoto = async (image: any) => {
    const url = config.serverAddress + '/api/photo';
    const formData = new FormData();

    formData.append('image', {
        name: 'image',
        type: 'image/jpeg',
        uri: image,
    });

    console.log("form data", formData);

    return axios.post(url, formData)
    .then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
});
}

export default { submitPhoto }
import FormData from 'form-data'
import studentApi from '../api/student-api';

const uploadImage = async (imageURI: String) => {
    var body = new FormData();
    body.append('file', { name: "name", type: "image/jpeg", uri: imageURI });
    try {
        const res = await studentApi.uploadImage(body);
        if (res.status !== 200) {
            console.log("save failed " + res.data.problem);
        }
        else {
            if (res.data) {
                const d: any = res.data;
                console.log("url: " + d.url);
                return d.url;
            }
        }
    } catch (err) {
        console.log("save failed " + err);
    }
    return "";
}

export default { uploadImage }
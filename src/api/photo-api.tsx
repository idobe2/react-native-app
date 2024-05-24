import axios from "axios";
import FormData from "form-data";
import config from "../core/config";

const apiClient = axios.create({
  baseURL: config.serverAddress,
  headers: { Accept: "application/vnd.github.v3+json" },
});

interface UploadImageResponse {
  message: string;
  url: string;
}

const submitPhoto = async (imageUri: string) => {
  console.log("submitting photo: ", imageUri);
  const url = `http://${config.serverAddress}/file/upload`;
  try {
    const formData = new FormData();
    const uriParts = imageUri.split(".");
    const fileType = uriParts[uriParts.length - 1];
    const filename = "photo" + Date.now().toString() + "." + fileType;
    formData.append("file", {
      uri: imageUri,
      type: `image/${fileType}`,
      name: filename,
    });
    console.log("form data", formData);
    console.log("url:", url);
    const responseFromServer = await apiClient.post("/file/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    const data = responseFromServer.data as UploadImageResponse;
    if (data.message !== "Uploaded successfully") {
      console.log("save failed " + responseFromServer.status); //TODO
    } else {
      console.log("save passed");
      const url = data.url;
      return url;
    }
  } catch (err) {
    console.log("save failed " + err);
  }
  return "";
};

export default { submitPhoto };

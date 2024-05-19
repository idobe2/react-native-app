import axios from "axios";
import FormData from 'form-data';
import config from "../core/config";

const submitPhoto = async (pickerResult: any) => {
    let uploadResponse, uploadResult;

    console.log("submitting photo: ", pickerResult);

    try {
      
      if (!pickerResult.canceled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri);
        uploadResult = await uploadResponse.json();
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      if (!pickerResult.canceled) {
        alert('Upload success');
      } else {
        alert('Upload cancelled');
      }
    }
  };

  async function uploadImageAsync(uri: string) {
    const apiUrl = `${config.serverAddress}/UploadPhoto`;
    
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];
  
    const formData = new FormData();
    formData.append('photo', {
      uri,
      name: `photo.${fileType}`,
      type: `image/${fileType}`,
    } as any);
  
    const options = {
      method: 'POST',
      body: formData as any,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    };
  
    return fetch(apiUrl, options);
  }

// const submitPhoto = async (imageUri: string) => {
//     console.log("submitting photo: ", imageUri);
//     const url = `${config.serverAddress}/file`;
//     const formData = new FormData();

//     formData.append('image', {
//         name: 'upload.jpg',
//         type: 'image/jpeg',
//         uri: imageUri,
//     });
//     console.log("form data", formData);

//     // const uploadResult = await FileSystem.uploadAsync(url, imageUri, {
//     //   httpMethod: 'POST',
//     //   uploadType: FileSystem.FileSystemUploadType.MULTIPART,
//     //   fieldName: 'demo_image'
//     // });

//     return axios.post(url, formData)
//     .then(function (response) {
//         console.log(response.data);
//     }).catch(function (error) {
// });
// }

export default { submitPhoto }
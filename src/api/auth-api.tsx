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

  export default { extractIdFromResponse }
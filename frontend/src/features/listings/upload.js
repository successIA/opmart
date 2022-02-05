import api from "../../api";

export const uploadListingImage = async (image) => {
  const data = new FormData();
  data.append("image", image.file);

  const response = await api.post("/listing-images/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: image.abortController.signal,
  });

  return response.data;
};

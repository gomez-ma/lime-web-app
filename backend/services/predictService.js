import axios from "axios";
import fs from "fs";
import FormData from "form-data";

export const predictImage = async (imagePath) => {
  const form = new FormData();
  form.append("file", fs.createReadStream(imagePath));

  const res = await axios.post("http://localhost:8000/predict", form, {
    headers: form.getHeaders()
  });

  return res.data;
};
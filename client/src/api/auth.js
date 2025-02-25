import axios from "axios";

export const registerUser = async (userData) => {
  try {
    const API_URL = "http://localhost:4200/api/users";
    const response = await axios.post(API_URL, userData, {
      headers: {
        "Content-Type": "multipart/form-data", // Важно для отправки файлов
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка регистрации на api/auth.js");
    throw error;
  }
};

export const loginUser = async (username, password) => {
  try {
    const API_URL = "http://localhost:4200/api/users";

    const response = await axios.get(
      `${API_URL}/auth?username=${username}&password=${password}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error);
    }
    console.log(error);
    throw error;
  }
};

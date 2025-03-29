import axios from "axios";

export const registerUser = async (formData) => {
  try {
    const API_URL = "http://localhost:4200/api/users";

    const response = await axios.post(API_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const API_URL = "http://localhost:4200/api/users";

    const response = await axios.post(
      `${API_URL}/auth`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage = error.response.data.error || "Ошибка авторизации";
      console.error("Ошибка авторизации:", errorMessage);
      throw new Error(errorMessage);
    } else if (error.request) {
      console.error("Нет ответа от сервера:", error.request);
      throw new Error("Сервер не отвечает");
    } else {
      console.error("Ошибка настройки запроса:", error.message);
      throw new Error("Ошибка при отправке запроса");
    }
  }
};
import axios from "axios";

export const registerUser = async (userData) => {
  try {
    const API_URL = "http://localhost:4200/api/users";
    const formData = new FormData();

    for (const key in userData) {
      if (userData[key] instanceof File) {
        formData.append(key, userData[key], userData[key].name);
      } else {
        formData.append(key, userData[key]);
      }
    }

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

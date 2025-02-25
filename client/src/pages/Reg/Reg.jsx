// src/pages/Reg/Reg.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../api/auth";
import "./Reg.scss"; // Импортируем стили
import StarBackground from "../../components/StarBackground/StarBackground";

function Reg() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null); // Для хранения файла аватара
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(); // Создаем FormData для отправки данных с файлом
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) {
      formData.append("avatar", avatar); // Добавляем файл аватара
    }

    try {
      const newUser = await registerUser(formData); // Отправляем запрос на сервер
      console.log("Пользователь успешно зарегистрирован:", newUser);
      alert(`Пользователь ${username} успешно зарегистрирован!`);
      navigate("/auth"); // Перенаправляем на страницу авторизации
    } catch (error) {
      console.error(
        "Ошибка при регистрации пользователя:",
        error.response ? error.response.data : error
      ); // Выводим сообщение об ошибке
      alert(
        `Ошибка при регистрации: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatar(file); // Сохраняем выбранный файл
  };

  return (
    <>
      <StarBackground />
      <div className="box-container" id="content">
        <form onSubmit={handleSubmit} id="reg-form">
          <h2>Регистрация</h2>
          <div className="input-form">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Придумайте никнейм"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-form">
            <label htmlFor="email">Email</label>
            <input
              type="email" // Изменили type на "email"
              id="email"
              placeholder="Ваш email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-form">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Придумайте пароль"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-form">
            <label htmlFor="avatar">Avatar</label>
            <input
              type="file"
              id="avatar"
              accept="image/*" // Ограничиваем выбор только изображениями
              onChange={handleAvatarChange}
            />
          </div>
          <div className="submit-form">
            <button type="submit">Зарегистрироваться</button>
          </div>
          <span className="info">
            <p>
              Уже есть аккаунт? <Link to="/auth">Войти</Link>
            </p>
          </span>
        </form>
      </div>
    </>
  );
}

export default Reg;

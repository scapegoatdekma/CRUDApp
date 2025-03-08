import React, { useContext, useState } from "react";
import "./Auth.scss";
import { useNavigate, Link } from "react-router-dom";
import StarBackground from "../../components/StarBackground/StarBackground";
import { loginUser } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext/AuthContext";

function Auth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const user = await loginUser(username, password);

      console.log(user);

      login(user.token, user);
      // console.table(user);
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error);
      alert(error.message); // Отображаем сообщение об ошибке пользователю
    }
  };

  return (
    <>
      <StarBackground />
      <div className="box-container" id="content">
        <form onSubmit={handleSubmit} id="auth-form">
          <h2>Авторизация</h2>
          <div className="input-form">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="Ваш никнейм"
              required
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-form">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Ваш пароль"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="submit-form">
            <button type="submit">Войти</button>
          </div>

          <span className="info">
            <p>
              Нет аккаунта? <Link to="/reg">Зарегистрироваться</Link>
            </p>
          </span>
        </form>
      </div>
    </>
  );
}

export default Auth;

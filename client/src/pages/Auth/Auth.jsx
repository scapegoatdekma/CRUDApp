import React, { useContext, useState } from "react";
import "./Auth.scss";
import { useNavigate, Link } from "react-router-dom";
import StarBackground from "../../components/StarBackground/StarBackground";
import { loginUser } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext/AuthContext";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await loginUser(email, password);
      login(user.token, user);
      navigate("/");
    } catch (error) {
      console.error("Authentication failed:", error);
      setError(error.message);
    }
  };

  return (
    <>
      <StarBackground />
      <div className="box-container" id="content">
        <form onSubmit={handleSubmit} id="auth-form">
          <h2>Авторизация</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="input-form">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              placeholder="Ваш email"
              required
              onChange={(e) => setEmail(e.target.value)}
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
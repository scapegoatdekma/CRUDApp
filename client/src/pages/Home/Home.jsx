// src/pages/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import logout from "../../utils/auth"; // Импортируем функцию logout
// Импортируем необходимые иконки из Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faTachometer,
  faUsers,
  faBars,
  faEnvelope,
  faUser,
  faDownload,
  faLock,
  faUpload,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

function Home() {
  const [username, setUsername] = useState("");
  const [isSiderActive, setIsSiderActive] = useState(true);
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedAvatar = localStorage.getItem("avatar");

    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedAvatar) {
      setAvatar(storedAvatar);
    }
  }, []);

  const toggleSider = () => {
    setIsSiderActive(!isSiderActive);
  };

  const handleLogout = () => {
    logout(); // Вызываем функцию logout
    navigate("/auth");
  };

  return (
    <main className="main">
      <Sidebar
        isSiderActive={isSiderActive}
        username={username}
        avatar={avatar}
        toggleSider={toggleSider}
      />

      <div className="content">
        <header className="header">
          <div className="flex">
            <div className="left">
              <FontAwesomeIcon
                icon={faBars}
                className="burger-menu"
                id="toggle-sider"
                onClick={toggleSider}
              />
            </div>

            <div className="right">
              <div className="icons">
                <div className="icon-with-counter companyEl">
                  <FontAwesomeIcon icon={faUsers} className="company" />
                  <span className="counter">1</span>
                </div>

                <div className="icon-with-counter mailEl">
                  <FontAwesomeIcon icon={faEnvelope} className="mail" />
                  <span className="counter">1</span>
                </div>
              </div>

              <div
                className="user"
                onClick={handleLogout}
                style={{ cursor: "pointer" }}
              >
                {" "}
                {/* Добавляем onClick и style */}
                <FontAwesomeIcon icon={faUser} className="account" />
                <span className="user_name">{username || "{your_name}"}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="dashboard">
          <section className="title-section">
            <div className="title">
              <FontAwesomeIcon icon={faTachometer} />
              <h2>Dashboard</h2>
            </div>
            <p className="subtitle">Основная информация</p>
          </section>

          <section className="card-section">
            <div className="card-element">
              <div className="content">
                <FontAwesomeIcon icon={faDownload} />
                <div className="counter">316</div>
                <div className="title">Входящие заявки</div>
              </div>
              <Link to="#" className="goto">
                Перейти
              </Link>
            </div>
            <div className="card-element">
              <div className="content">
                <FontAwesomeIcon icon={faLock} />
                <div className="counter">18</div>
                <div className="title">Взято в обработку мной</div>
              </div>
              <Link to="#" className="goto">
                Перейти
              </Link>
            </div>
            <div className="card-element">
              <div className="content">
                <FontAwesomeIcon icon={faUpload} />
                <div className="counter">274</div>
                <div className="title">Исходящие заявки</div>
              </div>
              <Link to="#" className="goto">
                Перейти
              </Link>
            </div>
            <div className="card-element">
              <div className="content">
                <FontAwesomeIcon icon={faCheck} />
                <div className="counter">14</div>
                <div className="title">Выполненные заявки</div>
              </div>
              <Link to="#" className="goto">
                Перейти
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Home;

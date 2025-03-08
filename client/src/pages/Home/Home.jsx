// src/pages/Home/Home.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import logout from "../../utils/auth"; // Импортируем функцию logout
// Импортируем необходимые иконки из Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/Header/Header";

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
import { AuthContext } from "../../context/AuthContext/AuthContext";

function Home() {
  const [isSiderActive, setIsSiderActive] = useState(true);
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
        toggleSider={toggleSider}
      />

      <div className="content">
        <Header
          toggleSider={toggleSider}
          handleLogout={handleLogout}
        />

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

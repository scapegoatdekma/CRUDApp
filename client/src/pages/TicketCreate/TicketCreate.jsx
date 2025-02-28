// src/pages/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TicketCreate.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import logout from "../../utils/auth"; // Импортируем функцию logout
// Импортируем необходимые иконки из Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../../components/Header/Header";
import TicketCreateSection from "../../components/TicketCreateSection/TicketCreateSection";

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

function TicketCreate() {
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
        <Header
          username={username}
          toggleSider={toggleSider}
          handleLogout={handleLogout}
        />
        <TicketCreateSection />
      </div>
    </main>
  );
}

export default TicketCreate;

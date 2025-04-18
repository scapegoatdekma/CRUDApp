// src/pages/Home/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./TicketCreate.scss";
import Sidebar from "../Sidebar/Sidebar";
import logout from "../../utils/auth"; // Импортируем функцию logout
// Импортируем необходимые иконки из Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../Header/Header";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext/AuthContext";
import TicketForm from "../TicketForm/TicketForm";

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
import Layout from "../../Layout/Layout";

function TicketCreate() {
  const [username, setUsername] = useState("");
  const [isSiderActive, setIsSiderActive] = useState(true);
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (currentUser) {
      setIsLoading(false);
    }
  }, [currentUser]);

  if (isLoading) {
    return <div className="loading">Загрузка данных пользователя...</div>;
  }

  const toggleSider = () => {
    setIsSiderActive(!isSiderActive);
  };

  const handleLogout = () => {
    logout(); // Вызываем функцию logout
    navigate("/auth");
  };

  return (
    <Layout isSiderActive={isSiderActive} toggleSider={toggleSider} handleLogout={handleLogout}>
      <TicketForm></TicketForm>
    </Layout>
  );
}

export default TicketCreate;

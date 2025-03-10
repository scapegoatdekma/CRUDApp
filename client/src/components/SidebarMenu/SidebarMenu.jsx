// src/components/SidebarMenu/SidebarMenu.jsx
import React, { useState, useEffect } from "react";
import "./SidebarMenu.scss";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTachometer,
  faTag,
  faNewspaper,
  faListAlt,
  faMessage,
  faUsers,
  faSitemap,
  faBook,
  faBarChart,
  faShield,
} from "@fortawesome/free-solid-svg-icons";

function SidebarMenu() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const handleItemClick = (path) => {
    setActiveItem(path);
  };

  const menuItems = [
    { path: "/", id: "home", icon: faTachometer, label: "Dashboard" },
    { path: "/ticket_create", id: "ticket_create", icon: faTag, label: "Создать заявку" },
    { path: "/news", id: "news", icon: faNewspaper, label: "Новости" },
    { path: "/tickets", id: "tickets", icon: faListAlt, label: "Список заявок" },
    { path: "/messages", id: "messages", icon: faMessage, label: "Сообщения" },
    { path: "/staff", id: "staff", icon: faUsers, label: "Сотрудники" },
    { path: "/faq", id: "faq", icon: faSitemap, label: "Центр знаний" },
    { path: "/dictionary", id: "dictionary", icon: faBook, label: "Блокнот" },
    { path: "/reports", id: "reports", icon: faBarChart, label: "Отчёты" },
    { path: "/admin_panel", id: "admin_panel", icon: faShield, label: "Администрирование" },
  ];

  return (
    <ul className="sider-menu">
      {menuItems.map((item) => (
        <Link
          key={item.id} // Используем item.id в качестве key
          to={item.path}
          className={`item ${activeItem === item.path ? "active" : ""}`}
          id={item.id}
          onClick={() => handleItemClick(item.path)}
        >
          <FontAwesomeIcon icon={item.icon} />
          <li>{item.label}</li>
        </Link>
      ))}
    </ul>
  );
}

export default SidebarMenu;
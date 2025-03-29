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
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";

function SidebarMenu() {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [isTicketsOpen, setIsTicketsOpen] = useState(false);

  useEffect(() => {
    setActiveItem(location.pathname);
    // Автоматически открываем меню если находимся на связанной странице
    if (["/tickets", "/ticket_create"].includes(location.pathname)) {
      setIsTicketsOpen(true);
    }
  }, [location.pathname]);

  const handleTicketsHover = (isOpen) => {
    if (window.innerWidth > 768) { // Только для десктопной версии
      setIsTicketsOpen(isOpen);
    }
  };

  const menuItems = [
    { path: "/", id: "home", icon: faTachometer, label: "Dashboard" },
    { 
      id: "tickets",
      icon: faListAlt,
      label: "Заявки",
      subItems: [
        { path: "/tickets", id: "ticket_list", label: "Список заявок" },
        { path: "/ticket_create", id: "ticket_create", label: "Создать заявку" },
      ]
    },
    { path: "/news", id: "news", icon: faNewspaper, label: "Новости" },
    { path: "/chat", id: "messages", icon: faMessage, label: "Сообщения" },
    { path: "/staff", id: "staff", icon: faUsers, label: "Сотрудники" },
    { path: "/faq", id: "faq", icon: faSitemap, label: "Центр знаний" },
    { path: "/dictionary", id: "dictionary", icon: faBook, label: "Блокнот" },
    { path: "/reports", id: "reports", icon: faBarChart, label: "Отчёты" },
    { path: "/admin_panel", id: "admin_panel", icon: faShield, label: "Администрирование" },
  ];

  return (
    <ul className="sider-menu">
      {menuItems.map((item) => {
        if (item.subItems) {
          return (
            <li 
              key={item.id}
              className={`dropdown-container ${isTicketsOpen ? "open" : ""}`}
              onMouseEnter={() => handleTicketsHover(true)}
              onMouseLeave={() => handleTicketsHover(false)}
            >
              <div 
                className={`dropdown-header ${
                  item.subItems.some(sub => sub.path === activeItem) ? "active" : ""
                }`}
                onClick={() => setIsTicketsOpen(!isTicketsOpen)}
              >
                <FontAwesomeIcon icon={item.icon} />
                <span>{item.label}</span>
                <FontAwesomeIcon 
                  icon={isTicketsOpen ? faChevronUp : faChevronDown} 
                  className="dropdown-arrow"
                />
              </div>
              
              {isTicketsOpen && (
                <ul className="dropdown-menu">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      to={subItem.path}
                      className={`dropdown-item ${
                        activeItem === subItem.path ? "active" : ""
                      }`}
                      onClick={() => setActiveItem(subItem.path)}
                    >
                      <li>{subItem.label}</li>
                    </Link>
                  ))}
                </ul>
              )}
            </li>
          );
        }
        
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`item ${activeItem === item.path ? "active" : ""}`}
            onClick={() => setActiveItem(item.path)}
          >
            <FontAwesomeIcon icon={item.icon} />
            <li>{item.label}</li>
          </Link>
        );
      })}
    </ul>
  );
}

export default SidebarMenu;
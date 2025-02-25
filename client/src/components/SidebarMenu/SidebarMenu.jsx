// src/components/SidebarMenu/SidebarMenu.jsx
import React from "react";
import "./SidebarMenu.scss";
import { Link } from "react-router-dom";
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
  return (
    <ul className="sider-menu">
      <Link to="/" className="item" id="home">
        <FontAwesomeIcon icon={faTachometer} />
        <li>Dashboard</li>
      </Link>
      <Link to="/ticket_create" className="item" id="ticket_create">
        <FontAwesomeIcon icon={faTag} />
        <li>Создать заявку</li>
      </Link>
      <Link to="#" className="item" id="news">
        <FontAwesomeIcon icon={faNewspaper} />
        <li>Новости</li>
      </Link>
      <Link to="#" className="item" id="tickets">
        <FontAwesomeIcon icon={faListAlt} />
        <li>Список заявок</li>
      </Link>
      <Link to="#" className="item" id="messages">
        <FontAwesomeIcon icon={faMessage} />
        <li>Сообщения</li>
      </Link>
      <Link to="#" className="item" id="staff">
        <FontAwesomeIcon icon={faUsers} />
        <li>Сотрудники</li>
      </Link>
      <Link to="#" className="item" id="faq">
        <FontAwesomeIcon icon={faSitemap} />
        <li>Центр знаний</li>
      </Link>
      <Link to="#" className="item" id="dictionary">
        <FontAwesomeIcon icon={faBook} />
        <li>Блокнот</li>
      </Link>
      <Link to="#" className="item" id="reports">
        <FontAwesomeIcon icon={faBarChart} />
        <li>Отчёты</li>
      </Link>
      <Link to="#" className="item" id="admin_panel">
        <FontAwesomeIcon icon={faShield} />
        <li>Администрирование</li>
      </Link>
    </ul>
  );
}

export default SidebarMenu;

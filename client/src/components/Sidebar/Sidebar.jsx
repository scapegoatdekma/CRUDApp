// src/components/Sidebar/Sidebar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/svg/icon-white.svg";
import emptyAvatar from "../../assets/images/png/empty-avatar.jpg";
import SidebarMenu from "../SidebarMenu/SidebarMenu";
import "./Sidebar.scss";
import { AuthContext } from "../../context/AuthContext/AuthContext";

function Sidebar({ isSiderActive }) {

  const { currentUser } = useContext(AuthContext);
  

  return (
    <aside className={`sider ${isSiderActive ? "active" : ""}`} id="sider">
      <Link to="#" className="logo">
        <div className="brand">
          <img src={logo} alt="SolLine Logo" />
          <span> SolLine </span>
        </div>
      </Link>
      <div className={`sider_content ${isSiderActive ? "active" : ""}`}>
        <div className="sider-user">
          <img
            src={currentUser.avatar ? currentUser.avatar : emptyAvatar}
            className="avatar"
            alt="User Avatar"
          />
          <div className="content">
            <div className="name">
              Привет,{" "}
              <span className="user_name">{currentUser.username || "user"}</span>
              <div className="online">online</div>
            </div>
          </div>
        </div>
        <SidebarMenu />
      </div>
    </aside>
  );
}

export default Sidebar;

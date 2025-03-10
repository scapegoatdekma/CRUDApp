import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Header.scss";
import {
  faBars,
  faUser,
  faEnvelope,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../context/AuthContext/AuthContext";

const Header = ({ toggleSider, handleLogout }) => {
  
  const { currentUser } = useContext(AuthContext);

  return (
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
            <FontAwesomeIcon icon={faUser} className="account" />
            <span className="user_name">{currentUser.user.username || "{your_name}"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

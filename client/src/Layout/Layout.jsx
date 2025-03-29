// src/components/Layout/Layout.jsx
import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
// import "./Layout.scss"; // Если нужно добавить стили

function Layout({ children, isSiderActive, toggleSider, handleLogout }) {
  return (
    <main className="main">
      <Sidebar isSiderActive={isSiderActive} toggleSider={toggleSider} />
      <div className="content">
        <Header toggleSider={toggleSider} handleLogout={handleLogout} />
        {children}
      </div>
    </main>
  );
}

export default Layout;
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [avatar, setAvatar] = useState(localStorage.getItem("avatar"));

  useEffect(() => {
    localStorage.setItem("token", token || "");
    // console.log(token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("username", username || "");
    // console.log(username);
  }, [username]);

  useEffect(() => {
    localStorage.setItem("avatar", avatar || "");
    // console.log(avatar);
  }, [avatar]);

  const login = (newToken, username, avatar) => {
    setToken(newToken);
    setUsername(username);
    setAvatar(avatar);
  };

  const logout = () => {
    setToken(null);
    setUsername(null);
    setAvatar(null);
  };

  const value = {
    token,
    username,
    avatar,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

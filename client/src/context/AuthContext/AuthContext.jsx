import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("currentUser");
      return savedUser ? JSON.parse(savedUser) : {
        username: 'Гость',
        role: 'Не определено',
        email: 'N/A',
        login: 'dekmaOFF',
        avatar: '/default-avatar.png'
      };
    } catch {
      return {
        username: 'Гость',
        role: 'Не определено',
        email: 'N/A',
        login: 'dekmaOFF',
        avatar: '/default-avatar.png'
      };
    }
  });
  
  // Имитация загрузки пользователя при монтировании
  useEffect(() => {
    if (!currentUser) {
      setTimeout(() => {
        setCurrentUser(mockUser);
        localStorage.setItem("currentUser", JSON.stringify(mockUser));
      }, 1000);
    }
  }, []);

  const login = (newToken, userData) => {
    
    setToken(newToken);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    console.log(JSON.parse(localStorage.getItem("currentUser")));
    setCurrentUser(userData);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
  };

  const value = {
    token,
    currentUser,
    login,
    logout,
    updateUser: setCurrentUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
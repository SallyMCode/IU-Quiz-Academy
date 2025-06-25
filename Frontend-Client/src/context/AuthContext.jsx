import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null = nicht eingeloggt

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    // hier auch Token löschen, falls genutzt
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

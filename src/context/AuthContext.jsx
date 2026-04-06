import { useState } from 'react';
import { AuthContext } from './auth-context';

function loadStoredUser() {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      return null;
    }

    return JSON.parse(userData);
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadStoredUser);
  const loading = false;

  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (data) => {
    const updated = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    setUser(updated);
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isStudent = () => user?.role === 'STUDENT';

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAdmin, isStudent, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

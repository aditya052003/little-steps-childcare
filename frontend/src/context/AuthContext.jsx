import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Load demo users and set default as Parent (Sarah Jenkins)
  useEffect(() => {
    async function initUsers() {
      try {
        const res = await api.getUsers();
        if (res.success && res.data.length > 0) {
          setUsers(res.data);
          const savedUserId = localStorage.getItem('little_steps_user_id');
          const found = res.data.find(u => u.id === savedUserId);
          setCurrentUser(found || res.data[0]); // default to parent
        }
      } catch (err) {
        console.error('Failed to load initial users:', err);
      } finally {
        setLoading(false);
      }
    }
    initUsers();
  }, []);

  const switchPersona = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('little_steps_user_id', target.id);
      showToast(`Switched view to ${target.name} (${target.role.toUpperCase()})`, 'info');
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const value = {
    users,
    currentUser,
    setCurrentUser,
    switchPersona,
    loading,
    toast,
    showToast
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

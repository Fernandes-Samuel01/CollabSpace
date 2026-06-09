import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/auth.service.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // initial auth check

  // ---- Check auth on mount ----
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }
        const res = await authService.getMe();
        setUser(res.data.user);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // ---- Login ----
  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const { user, token } = res.data;
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  };

  // ---- Logout ----
  const logout = async () => {
    try {
      await authService.logout();
    } catch (_) {}
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
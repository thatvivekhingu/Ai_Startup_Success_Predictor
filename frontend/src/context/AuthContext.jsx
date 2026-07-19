import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);
const storedUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("ss_user") ||
        sessionStorage.getItem("ss_user") ||
        "null",
    );
  } catch {
    localStorage.removeItem("ss_user");
    sessionStorage.removeItem("ss_user");
    return null;
  }
};
export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(storedUser);
  useEffect(() => {
    const token =
      localStorage.getItem("ss_token") || sessionStorage.getItem("ss_token");
    if (!token) {
      setUser(null);
      setReady(true);
      return;
    }
    api
      .get("/me")
      .then(({ data }) => {
        const storage = localStorage.getItem("ss_token")
          ? localStorage
          : sessionStorage;
        storage.setItem("ss_user", JSON.stringify(data));
        setUser(data);
      })
      .catch(() => {
        localStorage.removeItem("ss_token");
        localStorage.removeItem("ss_user");
        sessionStorage.removeItem("ss_token");
        sessionStorage.removeItem("ss_user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);
  const login = async (values) => {
    const { data } = await api.post("/login", values);
    const storage = values.remember_me ? localStorage : sessionStorage;
    const otherStorage = values.remember_me ? sessionStorage : localStorage;
    otherStorage.removeItem("ss_token");
    otherStorage.removeItem("ss_user");
    storage.setItem("ss_token", data.access_token);
    storage.setItem("ss_user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const register = async (values) => {
    const { data } = await api.post("/register", values);
    localStorage.setItem("ss_token", data.access_token);
    localStorage.setItem("ss_user", JSON.stringify(data.user));
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem("ss_token");
    localStorage.removeItem("ss_user");
    sessionStorage.removeItem("ss_token");
    sessionStorage.removeItem("ss_user");
    setUser(null);
  };
  const updateUser = (nextUser) => {
    const storage = localStorage.getItem("ss_token")
      ? localStorage
      : sessionStorage;
    storage.setItem("ss_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };
  return (
    <AuthContext.Provider
      value={useMemo(
        () => ({ user, ready, login, register, logout, updateUser }),
        [user, ready],
      )}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);

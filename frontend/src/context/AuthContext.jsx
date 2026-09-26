import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getCurrentUser } from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user_info");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
          localStorage.setItem("user_info", JSON.stringify(userData));
        } catch (err) {
          console.warn("Session expired or invalid token:", err);
          localStorage.removeItem("token");
          localStorage.removeItem("user_info");
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleLogin = async (email, password) => {
    const res = await loginUser(email, password);
    setUser(res.user);
    localStorage.setItem("user_info", JSON.stringify(res.user));
    return res;
  };

  const handleRegister = async (fullName, email, password) => {
    const res = await registerUser(fullName, email, password);
    setUser(res.user);
    localStorage.setItem("user_info", JSON.stringify(res.user));
    return res;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        register: handleRegister,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
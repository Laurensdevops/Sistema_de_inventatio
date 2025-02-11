import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { loginUser, logoutUser } from "../core/redux/action";
import { login as apiLogin, logout as apiLogout } from "../services/authService";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    try {
      const userData = await apiLogin(email, password);
      dispatch(loginUser(userData.user, userData.token));
      navigate("/product-list");
    } catch (err) {
      setError("Credenciales incorrectas. Inténtelo nuevamente.");
    }
  };

  const logout = async () => {
    try {
      await apiLogout();
      dispatch(logoutUser());
      navigate("/signin");
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  return { user, login, logout, error };
};

export default useAuth;

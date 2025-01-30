import { apiRequest } from "./apiClient";

export const login = async (email, password) => {
  try {
    const response = await apiRequest("users/login", "POST", { email, password });

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(response.user)); 

    return response.user;
  } catch (error) {
    console.error("Error en login:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await apiRequest("users/logout", "POST");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload(); 
};

export const getUser = async () => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) return JSON.parse(storedUser);

  try {
    const user = await apiRequest("users/me");
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return null;
  }
};

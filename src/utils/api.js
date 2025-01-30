const API_URL = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || "Error en la petición");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const login = async (email, password) => {
  const response = await apiRequest("users/login", "POST", { email, password });

  localStorage.setItem("token", response.token);
  localStorage.setItem("user", JSON.stringify(response.user)); 

  return response.user;
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

  const user = await apiRequest("users/me");
  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const getProducts = async () => {
  return await apiRequest("products");
};

export const createProduct = async (productData) => {
  return await apiRequest("products", "POST", productData);
};

export const updateProduct = async (id, productData) => {
  return await apiRequest(`products/${id}`, "PATCH", productData);
};

export const deleteProduct = async (id) => {
  return await apiRequest(`products/${id}`, "DELETE");
};

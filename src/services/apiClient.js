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

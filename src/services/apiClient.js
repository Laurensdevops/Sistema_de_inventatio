const API_URL = "http://localhost:3000/api";

const getToken = () => localStorage.getItem("token");

export const apiRequest = async (endpoint, method = "GET", body = null, queryParams = {}) => {
  const token = getToken();
  const headers = {};

  if (!(body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let url = `${API_URL}/${endpoint}`;
  if (method === "GET" && queryParams && Object.keys(queryParams).length > 0) {
    const qs = new URLSearchParams(queryParams).toString();
    url = `${url}?${qs}`;
  }

  const config = {
    method,
    headers,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  };

  if (method === "GET") {
    delete config.body;
  }

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return {};
    }

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

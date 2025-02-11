import { apiRequest } from "./apiClient";

export const getClientByEmail = async (email) => {
  try {
    return await apiRequest(`clients?where[email][equals]=${encodeURIComponent(email)}`);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    throw error;
  }
};

export const createClient = async (clientData) => {
  try {
    return await apiRequest("clients", "POST", clientData);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    throw error;
  }
};

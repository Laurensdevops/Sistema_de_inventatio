import { apiRequest } from "./apiClient";

export const getCouriersByProvince = async (province) => {
  try {
    const queryParams = {
      where: JSON.stringify({
        role: { equals: "courier" },
        province: { equals: province }
      })
    };

    const response = await apiRequest("users", "GET", null, queryParams);
    return response.docs || response;
  } catch (error) {
    console.error("Error fetching couriers by province:", error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await apiRequest("users", "GET", null);
    return response.docs || response;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const response = await apiRequest(`users/${userId}`, "GET");
    return response;
  } catch (error) {
    console.error("Error fetching user by id:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    return await apiRequest("users", "POST", userData);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId, userData) => {
  try {
    return await apiRequest(`users/${userId}`, "PATCH", userData);
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    return await apiRequest(`users/${userId}`, "DELETE");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


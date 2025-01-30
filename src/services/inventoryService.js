import { apiRequest } from "./apiClient";

export const getInventory = async () => {
  try {
    return await apiRequest("inventory");
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    throw error;
  }
};

export const updateInventory = async (id, inventoryData) => {
  try {
    return await apiRequest(`inventory/${id}`, "PATCH", inventoryData);
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    throw error;
  }
};

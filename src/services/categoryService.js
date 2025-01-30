import { apiRequest } from "./apiClient";

export const getCategories = async () => {
  try {
    return await apiRequest("categories");
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
};

export const createCategory = async (categoryData) => {
  try {
    return await apiRequest("categories", "POST", categoryData);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    throw error;
  }
};

export const updateCategory = async (id, categoryData) => {
  try {
    return await apiRequest(`categories/${id}`, "PATCH", categoryData);
  } catch (error) {
    console.error("Error al actualizar categoría:", error);
    throw error;
  }
};

export const deleteCategory = async (id) => {
  try {
    return await apiRequest(`categories/${id}`, "DELETE");
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    throw error;
  }
};

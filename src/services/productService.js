import { apiRequest } from "./apiClient";

export const getProducts = async () => {
  try {
    return await apiRequest("products");
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

export const getRecentProduct = async () => {
  return await apiRequest("products/recent");
};

export const getBestSellers = async () => {
  return await apiRequest("products/best-sellers");
};

export const createProduct = async (productData) => {
  try {
    return await apiRequest("products", "POST", productData);
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    return await apiRequest(`products/${id}`, "PATCH", productData);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    return await apiRequest(`products/${id}`, "DELETE");
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

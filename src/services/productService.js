import { apiRequest } from "./apiClient";
import buildProductQuery from "../utils/buildProductQuery";

export const getProducts = (filters = null) => {
  const query = filters ? buildProductQuery(filters) : {};
  return apiRequest("products", "GET", null, query);
};

export const getRecentProduct = async () => {
  try {
    return await apiRequest("products/recent");
  } catch (error) {
    console.error("Error al obtener productos recientes:", error);
    throw error;
  }
};

export const getBestSellers = async () => {
  try {
    return await apiRequest("products/best-sellers");
  } catch (error) {
    console.error("Error al obtener productos mas vendidos:", error);
    throw error;
  }
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

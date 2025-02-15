export const updateProductStock = async (productId, change) => {
    return await apiRequest(`products/${productId}/stock`, "PATCH", { change });
  };
  
export const updateProductStock = async (req, productId, change) => {
  const product = await req.payload.findByID({
    collection: "products",
    id: productId,
  });
  
  if (!product) {
    throw new Error("Producto no encontrado");
  }
  
  const newStock = (product.stock || 0) + change;
  
  return await req.payload.update({
    collection: "products",
    id: productId,
    data: { stock: newStock },
  });
};

// src/utils/buildProductQuery.js
export default function buildProductQuery(filters = {}) {
  // Plano, sin objetos anidados, porque URLSearchParams necesita pares clave-valor
  const query = {};

  if (filters.colors?.length) {
    // where[colors][in]=red,blue
    query["where[colors][in]"] = filters.colors.join(",");
  }

  if (filters.sizes?.length) {
    query["where[sizes][in]"] = filters.sizes.join(",");
  }

  if (filters.shoeSizes.length) {
    query["where[shoeSizes][in]"] = filters.shoeSizes.join(",");
  }

  if (filters.inStockOnly) {
    query["where[stock][greater_than]"] = 0;
  }

  if (filters.priceMin != null) {
    query["where[prices.retail][greater_than_equal]"] = filters.priceMin;
  }
  if (filters.priceMax != null) {
    query["where[prices.retail][less_than_equal]"] = filters.priceMax;
  }

  if (filters.categoryId) {
    query["where[categories][in]"] = filters.categoryId;
  }

  return query;
}

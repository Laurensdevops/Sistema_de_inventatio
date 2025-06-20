import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import useLoading from "./useLoading";

const useProducts = (filters = null) => {
  const { loading, startLoading, stopLoading } = useLoading(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      startLoading();
      try {
        const productsData = await getProducts(filters);
        setData(productsData);        // ← docs, pagination, etc.
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError(err);
      } finally {
        stopLoading();
      }
    })();
  }, [JSON.stringify(filters)]);      // 🔄 se vuelve a disparar al cambiar filtros

  return { products: data, loading, error };
};

export default useProducts;

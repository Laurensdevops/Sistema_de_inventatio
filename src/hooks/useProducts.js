// src/hooks/useProducts.js
import { useState, useEffect } from "react";
import { getProducts } from "../services/productService";
import useLoading from "./useLoading";

const useProducts = (queryParams = {}) => {
  const { loading, startLoading, stopLoading } = useLoading(true);
  const [data, setData] = useState(null); // data completa con paginación
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductsData = async () => {
      startLoading();
      try {
        const productsData = await getProducts(queryParams);
        setData(productsData);
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError(err);
      } finally {
        stopLoading();
      }
    };

    fetchProductsData();
  }, [JSON.stringify(queryParams)]); // usar JSON.stringify para comparar objetos

  return { products: data, loading, error };
};

export default useProducts;

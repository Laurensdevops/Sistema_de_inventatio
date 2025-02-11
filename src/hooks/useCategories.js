// src/hooks/useCategories.js
import { useState, useEffect, useCallback } from "react";
import { getCategories } from "../services/categoryService";
import useLoading from "./useLoading";

const useCategories = () => {
  const { loading, startLoading, stopLoading } = useLoading(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const fetchCategoriesData = useCallback(async () => {
    startLoading();
    try {
      const data = await getCategories();
      setCategories(data.docs);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      setError(err);
    } finally {
      stopLoading();
    }
  }, []); // Se elimina startLoading y stopLoading del array

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  return { categories, loading, error, refreshCategories: fetchCategoriesData };
};

export default useCategories;

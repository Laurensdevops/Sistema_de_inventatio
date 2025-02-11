// Ejemplo de useLoading.js
import { useState, useCallback } from "react";

const useLoading = (initial = false) => {
  const [loading, setLoading] = useState(initial);

  const startLoading = useCallback(() => setLoading(true), []);
  const stopLoading = useCallback(() => setLoading(false), []);

  return { loading, startLoading, stopLoading };
};

export default useLoading;

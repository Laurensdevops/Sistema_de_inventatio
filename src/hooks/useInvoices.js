import { useState, useEffect } from "react";
import { getInvoices } from "../services/invoiceService"; 

const useInvoices = (queryParams = {}) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const data = await getInvoices(queryParams);
        setInvoices(data.docs || data);
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [JSON.stringify(queryParams)]);

  return { invoices, loading, error };
};

export default useInvoices;

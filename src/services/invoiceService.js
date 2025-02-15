import { apiRequest } from "./apiClient";

export const createInvoice = async (invoiceData) => {
  try {
    return await apiRequest("invoices", "POST", invoiceData);
  } catch (error) {
    console.error("Error al crear factura:", error);
    throw error;
  }
};

export const updateInvoice = async (invoiceId, invoiceData) => {
  try {
    return await apiRequest(`invoices/${invoiceId}`, "PATCH", invoiceData);
  } catch (error) {
    console.error("Error updating invoice:", error);
    throw error;
  }
};

export const getInvoices = async () => {
  try {
    return await apiRequest("invoices", "GET", null);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    throw error;
  }
};

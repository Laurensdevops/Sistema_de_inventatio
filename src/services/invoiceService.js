import { apiRequest } from "./apiClient";

export const createInvoice = async (invoiceData) => {
  try {
    return await apiRequest("invoices", "POST", invoiceData);
  } catch (error) {
    console.error("Error al crear factura:", error);
    throw error;
  }
};

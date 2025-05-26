import React from "react";                       // JSX en generatePDF
import html2canvas from "html2canvas";
import { getInvoiceById } from "../services/invoiceService";
import { pdf } from "@react-pdf/renderer";
import { InvoiceDocument } from "../feature-module/components/GeneratedPdf"; // AJUSTA la ruta si tu componente vive en otro lugar

/**
 * Divide un array en lotes de `size` elementos.
 * @param {Array} arr
 * @param {number} size
 */
export const chunk = (arr, size = 5) => {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
};

export const generatePNG = async (invoiceId, scale = 2) => {
  const invoice = await getInvoiceById(invoiceId);
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.left = "-9999px";
  document.body.appendChild(container);

  container.innerHTML = `
    <div style="font-family: Arial; padding: 10px; width: 800px;">
      <h2>Factura #${invoice.invoiceNumber}</h2>
      <p><strong>Cliente:</strong> ${invoice.Client?.name || ""}</p>
      <p><strong>Total:</strong> $${invoice.total}</p>
    </div>
  `;

  const canvas = await html2canvas(container, { scale, useCORS: true });
  const url = canvas.toDataURL("image/png");
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: `factura-${invoiceId}.png`,
  });
  link.click();
  document.body.removeChild(container);
};

export const generatePDF = async (invoice) => {
  const blob = await pdf(<InvoiceDocument invoice={invoice} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement("a"), {
    href: url,
    download: `factura-${invoice.invoiceNumber}.pdf`,
  });
  link.click();
  URL.revokeObjectURL(url);
};

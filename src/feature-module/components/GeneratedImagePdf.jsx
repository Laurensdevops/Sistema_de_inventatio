import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { getInvoiceById } from "../../services/invoiceService";
import { Link } from "react-router-dom";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PropTypes from "prop-types";

const InvoicePNGGenerator = ({ invoiceId }) => {
  const hiddenInvoiceRef = useRef(null);

  const handleGeneratePNG = async () => {
    try {
      // 1. Obtenemos los datos de la factura
      const invoiceData = await getInvoiceById(invoiceId);

      // 2. Llenamos el contenedor oculto con la factura
      fillHiddenInvoice(invoiceData);

      // 3. Esperamos un tick para que se renderice el HTML
      setTimeout(async () => {
        if (hiddenInvoiceRef.current) {
          // 4. Generamos el canvas con html2canvas
          //    Subimos la escala para mejorar la calidad (2 o 3)
          const canvas = await html2canvas(hiddenInvoiceRef.current, {
            scale: 2,
            useCORS: true,
          });

          // 5. Obtenemos la imagen en Base64
          const imgData = canvas.toDataURL("image/png");

          // 6. Creamos un enlace "invisible" para forzar la descarga
          const link = document.createElement("a");
          link.download = `factura-${invoiceId}.png`; // Nombre del archivo
          link.href = imgData;
          link.click();
        }
      }, 0);
    } catch (err) {
      console.error("Error generating PNG:", err);
    }
  };

  const fillHiddenInvoice = (invoiceData) => {
    if (!hiddenInvoiceRef.current) return;

    const invoiceDate = new Date(invoiceData.invoiceDate).toLocaleString();

    // Construimos el HTML para la factura
    hiddenInvoiceRef.current.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 10px; width: 800px;">
        <h2>Factura #${invoiceData.invoiceNumber}</h2>
        <p><strong>Fecha:</strong> ${invoiceDate}</p>
        <p><strong>Cliente:</strong> ${invoiceData.Client?.name || "Sin nombre"}</p>
        <p><strong>Teléfono:</strong> ${invoiceData.Client?.phone || "Sin teléfono"}</p>
        <p><strong>Dirección:</strong> ${invoiceData.Client?.address || "Sin dirección"}</p>
        <p><strong>Estado:</strong> ${invoiceData.status}</p>
        <p><strong>Provincia:</strong> ${invoiceData.province || ""}</p>
        <p><strong>Total:</strong> $${invoiceData.total || 0}</p>
        <h3>Productos</h3>
        <table style="width: 100%; border-collapse: collapse;" border="1">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${
              (invoiceData.items || [])
                .map(item => `
                  <tr>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity * item.price}</td>
                  </tr>
                `)
                .join("")
            }
          </tbody>
        </table>
      </div>
    `;
  };

  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Descargar PNG
    </Tooltip>
  );

  return (
    <div>
      <div className="page-header">
        <ul className="table-top-head">
          <li>
            <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
              <Link onClick={handleGeneratePNG}>
                <i data-feather="camera" className="feather-camera" />
              </Link>
            </OverlayTrigger>
          </li>
        </ul>
      </div>
      {/* Contenedor oculto para la factura */}
      <div
        ref={hiddenInvoiceRef}
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      />
    </div>
  );
};

InvoicePNGGenerator.propTypes = {
  invoiceId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default InvoicePNGGenerator;

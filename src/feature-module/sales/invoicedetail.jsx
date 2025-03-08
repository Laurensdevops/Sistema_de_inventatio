import React from "react";
import { useLocation } from "react-router-dom";
import { Table } from "react-bootstrap";

const InvoiceDetail = () => {
  const { state } = useLocation();
  const invoice = state?.initialInvoiceData;

  if (!invoice) {
    return <p>No se encontraron detalles de la factura.</p>;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <h4 className="mb-4">Detalles de la Factura #{invoice.invoiceNumber}</h4>
        
        <div className="row mb-4">
          {/* Cada bloque se mostrará en 3 columnas en PC (col-lg-4), 2 en tablet (col-md-6) y 1 en móvil (col-12) */}
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Cliente:</strong> {invoice.Client?.name || "No asignado"}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Teléfono:</strong> {invoice.Client?.phone || "No asignado"}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Email:</strong> {invoice.Client?.email || "No asignado"}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Dirección:</strong> {invoice.Client?.address || "No asignado"}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Método de Pago:</strong> {invoice.paymentMethod}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p>
              <strong>Fecha de Factura:</strong>{" "}
              {new Date(invoice.invoiceDate).toLocaleString()}
            </p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Total:</strong> ${invoice.total}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Estado:</strong> {invoice.status}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Región:</strong> {invoice.region}</p>
          </div>
          <div className="col-lg-4 col-md-6 col-12 mb-3">
            <p><strong>Provincia:</strong> {invoice.province}</p>
          </div>
          {invoice.notes && (
            <div className="col-lg-4 col-md-6 col-12 mb-3">
              <p><strong>Notas:</strong> {invoice.notes}</p>
            </div>
          )}
        </div>

        <h5>Productos Comprados</h5>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td>{item.productName}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.quantity * item.price}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default InvoiceDetail;

import React, { useState } from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink
} from "@react-pdf/renderer";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
/* eslint-disable react/prop-types */

const cssLink = {
  height: "38px",
  width: "38px",
  display: "flex",
  alignItems: "center",
  WebkitBoxAlign: "center",
  msFlexAlign: "center",
  justifyContent: "center",
  color: "#5B6670",
  WebkitJustifyContent: "center",
  msFlexPack: "center",
  border: "1px solid #e8ebed",
  background: "#ffffff",
  borderRadius: "8px",
  padding: "6px",
  fontSize: "18px",
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 10,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#eee",
    width: "25%",
    padding: 4,
    fontWeight: "bold",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ccc",
    width: "25%",
    padding: 4,
  },
});

const InvoiceDocument = ({ invoice }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Factura #{invoice.invoiceNumber}</Text>
        <Text>Fecha: {new Date(invoice.invoiceDate).toLocaleString()}</Text>
        <Text>Cliente: {invoice.Client?.name || "Sin nombre"}</Text>
        <Text>Teléfono: {invoice.Client?.phone || "Sin teléfono"}</Text>
        <Text>Dirección: {invoice.Client?.address || "Sin dirección"}</Text>
        <Text>Estado: {invoice.status}</Text>
        <Text>Provincia: {invoice.province}</Text>
        <Text>Total: ${invoice.total}</Text>
      </View>
      <View style={styles.section}>
        <Text style={{ marginBottom: 5, fontWeight: "bold" }}>Productos</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableColHeader}>Producto</Text>
            <Text style={styles.tableColHeader}>Cantidad</Text>
            <Text style={styles.tableColHeader}>Precio</Text>
            <Text style={styles.tableColHeader}>Subtotal</Text>
          </View>
          {invoice.items?.map((item, idx) => {
            const subtotal = (item.quantity || 0) * (item.price || 0);
            return (
              <View style={styles.tableRow} key={idx}>
                <Text style={styles.tableCol}>{item.productName}</Text>
                <Text style={styles.tableCol}>{item.quantity}</Text>
                <Text style={styles.tableCol}>{item.price}</Text>
                <Text style={styles.tableCol}>{subtotal}</Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={styles.section}>
        <Text>Región: {invoice.region}</Text>
        <Text>Tarifa: {invoice.tariff}</Text>
        <Text>Método de Pago: {invoice.paymentMethod}</Text>
        {invoice.notes && <Text>Notas: {invoice.notes}</Text>}
      </View>
    </Page>
  </Document>
);

const RealPDFGenerator = ({ invoice }) => {
  const [hover, setHover] = useState(false);

  const iconStyle = {
    transition: "color 0.3s ease",
    color: hover ? "#FF9F43" : "inherit",
  };

  return (
    <PDFDownloadLink
      document={<InvoiceDocument invoice={invoice} />}
      fileName={`factura-${invoice.invoiceNumber}.pdf`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      {({ loading }) =>
        loading ? (
          <span>Generando PDF...</span>
        ) : (
          <div className="page-header">
            <ul className="table-top-head">
              <li>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip id="pdf-tooltip">Descargar pdf</Tooltip>}
                >
                  <button
                    style={cssLink}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    <i
                      style={iconStyle}
                      data-feather="file-text"
                      className="feather-file-text"
                    />
                  </button>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
        )
      }
    </PDFDownloadLink>
  );
};

export default RealPDFGenerator;

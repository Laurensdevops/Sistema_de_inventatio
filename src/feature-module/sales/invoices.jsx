import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import useInvoices from "../../hooks/useInvoices";
import { updateInvoice } from "../../services/invoiceService";
import { getCouriersByProvince } from "../../services/usersService";

// Componentes para generar PDF
import InvoicePDFGenerator from "../components/GeneratedImagePdf"; // PDF a partir de imagen
import RealPDFGenerator from "../components/GeneratedPdf"; // PDF real con texto

const Invoices = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("pendiente");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const { invoices, loading, error } = useInvoices();

  const [editingInvoice, setEditingInvoice] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [courierSearch, setCourierSearch] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [cancelInvoice, setCancelInvoice] = useState(null);
  const [cancelNote, setCancelNote] = useState("");

  const tabs = [
    { key: "pendiente", label: "Pendientes" },
    { key: "completada", label: "Pagadas" },
    { key: "en_empaquetado", label: "Empaquetado" },
    { key: "cancelada", label: "Canceladas y no entregado" },
    { key: "cancelada_entregado", label: "Canceladas y entregado" },
    { key: "confirmada", label: "Confirmadas" },
    { key: "sinPagar", label: "Sin pagar" }
  ];

  const getId = (objOrId) =>
    typeof objOrId === "object" && objOrId !== null ? objOrId.id : objOrId;

  const invoiceDocs = Array.isArray(invoices)
    ? invoices
    : (invoices && invoices.docs) || [];

  let visibleDocs = invoiceDocs;
  let visibleTabs = tabs;

  if (currentUser.role === "seller") {
    visibleDocs = invoiceDocs.filter(
      (invoice) =>
        invoice.createdBy && getId(invoice.createdBy) === currentUser.id
    );
    visibleTabs = tabs.filter(tab =>
      ["pendiente", "cancelada", "cancelada_entregado"].includes(tab.key)
    );
  } else if (currentUser.role === "courier") {
    visibleDocs = invoiceDocs.filter(
      (invoice) =>
        invoice.assignedCourier &&
        getId(invoice.assignedCourier) === currentUser.id
    );
    visibleTabs = tabs.filter(tab =>
      ["en_empaquetado", "completada", "cancelada", "cancelada_entregado"].includes(tab.key)
    );
  } else if (currentUser.role === "warehouse") {
    visibleDocs = invoiceDocs.filter((invoice) => {
      if (invoice.status.toLowerCase() === "confirmada") {
        return true;
      }
      if (invoice.status.toLowerCase() === "en_empaquetado") {
        return true;
      }
      return invoice.assignedCourier && getId(invoice.assignedCourier) === currentUser.id;
    });
    visibleTabs = tabs.filter(tab =>
      ["en_empaquetado", "cancelada", "cancelada_entregado", "confirmada"].includes(tab.key)
    );
  }

  const filteredDocs = visibleDocs.filter((invoice) =>
    invoice.status.toLowerCase() === selectedTab.toLowerCase()
  );

  const totalPages = Math.ceil(filteredDocs.length / pageSize);
  const paginatedInvoices = filteredDocs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const changeInvoiceStatus = async (invoiceId, newStatus, extraData = {}) => {
    try {
      await updateInvoice(invoiceId, { status: newStatus, ...extraData });
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el estado de la factura:", error);
    }
  };

  const openEditModal = async (invoice) => {
    setEditingInvoice(invoice);
    setSelectedCourier(invoice.assignedCourier ? getId(invoice.assignedCourier) : "");
    setCourierSearch("");
    try {
      const fetchedCouriers = await getCouriersByProvince(invoice.province, invoice.region);
      console.log(fetchedCouriers)
      setCouriers(fetchedCouriers);
    } catch (err) {
      console.error("Error al cargar mensajeros:", err);
    }
  };

  const saveCourierAssignment = async () => {
    if (editingInvoice && selectedCourier) {
      try {
        await updateInvoice(editingInvoice.id, { assignedCourier: selectedCourier });
        setEditingInvoice(null);
        window.location.reload();
      } catch (err) {
        console.error("Error al asignar el mensajero:", err);
      }
    }
  };

  const openCancelModal = (invoice) => {
    setCancelInvoice(invoice);
    setCancelNote("");
  };

  const saveCancellation = async () => {
    if (cancelInvoice) {
      try {
        await updateInvoice(cancelInvoice.id, { status: "cancelada", cancelNote });
        setCancelInvoice(null);
        window.location.reload();
      } catch (err) {
        console.error("Error al cancelar la factura:", err);
      }
    }
  };

  const handleEditInvoice = (invoice) => {
    navigate(all_routes.invoicecreate, { state: { initialInvoiceData: invoice } });
  };

  const filteredCouriers = couriers.filter((courier) => {
    const locationMatch = editingInvoice?.province && editingInvoice.province.trim() !== ""
      ? courier.province === editingInvoice.province
      : courier.province === editingInvoice?.region;
    const matchesSearch = courier.email.toLowerCase().includes(courierSearch.toLowerCase());
    return matchesSearch && courier.role === "courier" && locationMatch;
  });

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Facturas</h4>
              <h6>Crear y manejar facturas</h6>
            </div>
          </div>
        </div>

        <nav className="nav nav-style-1 nav-pills mb-3" role="tablist">
          {visibleTabs.map((tab) => (
            <Link
              key={tab.key}
              className={`nav-link ${selectedTab === tab.key ? "active" : ""}`}
              to="#"
              onClick={() => {
                setSelectedTab(tab.key);
                setCurrentPage(1);
              }}
            >
              {tab.label}{" "}
              <span className="badge bg-secondary ms-1 rounded-pill">
                {visibleDocs.filter((inv) => inv.status.toLowerCase() === tab.key.toLowerCase()).length}
              </span>
            </Link>
          ))}
        </nav>

        <div className="tab-content">
          {loading ? (
            <p>Cargando facturas...</p>
          ) : error ? (
            <p>Error al cargar facturas.</p>
          ) : filteredDocs.length === 0 ? (
            <p>No se encontraron facturas para el estado &ldquo;{selectedTab}&rdquo;.</p>
          ) : (
            paginatedInvoices.map((invoice) => (
              // Tarjeta de factura con id para posibles capturas
              <div key={invoice.id} id={`invoice-card-${invoice.id}`} className="default-cover p-4 mb-3" style={{ position: "relative" }}>
                <span className="badge bg-secondary d-inline-block mb-4">
                  Order ID : #{invoice.invoiceNumber}
                </span>
                <div className="row">
                  <div className="col-sm-12 col-md-6 record mb-3">
                    <table>
                      <tbody>
                        <tr className="mb-3">
                          <td>Emitida</td>
                          <td className="colon">:</td>
                          <td className="text">
                            {invoice.createdBy ? invoice.createdBy.email : "No asignado"}
                          </td>
                        </tr>
                        <tr>
                          <td>Cliente</td>
                          <td className="colon">:</td>
                          <td className="text">{invoice.Client.name}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-sm-12 col-md-6 record mb-3">
                    <table>
                      <tbody>
                        <tr>
                          <td>Total</td>
                          <td className="colon">:</td>
                          <td className="text">${invoice.total || "0"}</td>
                        </tr>
                        <tr>
                          <td>Fecha</td>
                          <td className="colon">:</td>
                          <td className="text">{new Date(invoice.invoiceDate).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-sm-12 col-md-6 record mb-3">
                    <table>
                      <tbody>
                        <tr>
                          <td>Mensajero</td>
                          <td className="colon">:</td>
                          <td className="text">
                            {invoice.assignedCourier ? invoice.assignedCourier.email : "No asignado"}
                          </td>
                        </tr>
                        <tr>
                          <td>Estado</td>
                          <td className="colon">:</td>
                          <td className="text">{invoice.status}</td>
                        </tr>
                        <tr>
                          <td>Provincia</td>
                          <td className="colon">:</td>
                          <td className="text">{invoice.province}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Contenedor para los botones de PDF en la esquina superior derecha */}
                <div style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  display: "flex",
                  gap: "5px"
                }}>
                  {/* Botón PDF por imagen */}
                  <InvoicePDFGenerator invoiceId={invoice.id} />
                  {/* Botón PDF real (texto selectable) */}
                  <RealPDFGenerator invoice={invoice} />
                </div>

                <div className="btn-row d-flex align-items-center justify-content-between mt-3">
                  <Link
                    to={all_routes.invoiceview}
                    state={{ initialInvoiceData: invoice }}
                    className="btn btn-info btn-icon flex-fill"
                  >
                    Ver detalles
                  </Link>
                  {/* Resto de botones según estado */}
                  {invoice.status === "pendiente" && (
                    <>
                      <button onClick={() => handleEditInvoice(invoice)} className="btn btn-primary btn-icon flex-fill">
                        Editar Factura
                      </button>
                      <button onClick={() => changeInvoiceStatus(invoice.id, "confirmada")} className="btn btn-success btn-icon flex-fill">
                        Confirmar
                      </button>
                      <button onClick={() => openCancelModal(invoice)} className="btn btn-danger btn-icon flex-fill">
                        Cancelar
                      </button>
                    </>
                  )}
                  {invoice.status === "confirmada" && (
                    <>
                      <button onClick={() => handleEditInvoice(invoice)} className="btn btn-primary btn-icon flex-fill">
                        Editar Factura
                      </button>
                      <button onClick={() => changeInvoiceStatus(invoice.id, "en_empaquetado")} className="btn btn-success btn-icon flex-fill">
                        Confirmar Enpaquetado
                      </button>
                      <button onClick={() => openCancelModal(invoice)} className="btn btn-danger btn-icon flex-fill">
                        Cancelar
                      </button>
                    </>
                  )}
                  {invoice.status === "en_empaquetado" && (
                    <>
                      {(currentUser.role === "admin" || currentUser.role === "seller" || currentUser.role === "warehouse" || currentUser.role === "manager") && (
                        <button onClick={() => handleEditInvoice(invoice)} className="btn btn-primary btn-icon flex-fill">
                          Editar Factura
                        </button>
                      )}
                      {!invoice.assignedCourier && (
                        <button onClick={() => openEditModal(invoice)} className="btn btn-success btn-icon flex-fill">
                          Asignar Mensajero
                        </button>
                      )}
                      {invoice.assignedCourier &&
                        currentUser &&
                        getId(invoice.assignedCourier) === currentUser.id && (
                          <button onClick={() => changeInvoiceStatus(invoice.id, "completada")} className="btn btn-success btn-icon flex-fill">
                            Completar
                          </button>
                        )}
                      {currentUser.role === "admin" && (
                        <button onClick={() => changeInvoiceStatus(invoice.id, "completada")} className="btn btn-success btn-icon flex-fill">
                          Completar
                        </button>
                      )}
                      <button onClick={() => openCancelModal(invoice)} className="btn btn-danger btn-icon flex-fill">
                        Cancelar
                      </button>
                    </>
                  )}
                  {invoice.status === "cancelada" && (["admin", "manager", "warehouse"].includes(currentUser.role)) && (
                    <button onClick={() => changeInvoiceStatus(invoice.id, "cancelada_entregado")} className="btn btn-warning btn-icon flex-fill">
                      Marcar como entregado
                    </button>
                  )}
                  {invoice.status === "completada" && (
                    <>
                      {invoice.assignedCourier && getId(invoice.assignedCourier) === currentUser.id ? (
                        <button onClick={() => changeInvoiceStatus(invoice.id, "confirmada")} className="btn btn-success btn-icon flex-fill">
                          Revertir Pagada
                        </button>
                      ) : (["admin", "manager"].includes(currentUser.role)) && (
                        <button onClick={() => changeInvoiceStatus(invoice.id, "confirmada")} className="btn btn-success btn-icon flex-fill">
                          Cambiar de Pagada
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {filteredDocs.length > pageSize && (
          <div className="pagination-controls d-flex justify-content-center align-items-center mb-3">
            <Button
              variant="secondary"
              className="me-2"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="secondary"
              className="ms-2"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Modales para asignar mensajero y cancelar factura */}
        <Modal show={editingInvoice !== null} onHide={() => setEditingInvoice(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Asignar Mensajero</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingInvoice && (
              <>
                <p>
                  Asignar mensajero para la factura #{editingInvoice.invoiceNumber} (Provincia: {editingInvoice.province})
                </p>
                <Form.Group controlId="courierSearch">
                  <Form.Label>Buscar por correo</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese correo..."
                    value={courierSearch}
                    onChange={(e) => setCourierSearch(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="courierSelect" className="mt-3">
                  <Form.Label>Seleccionar Mensajero</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                  >
                    <option value="">Seleccione un mensajero</option>
                    {filteredCouriers.map((courier) => (
                      <option key={courier.id} value={courier.id}>
                        {courier.name} ({courier.email})
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditingInvoice(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={saveCourierAssignment}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={cancelInvoice !== null} onHide={() => setCancelInvoice(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancelar Factura</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cancelInvoice && (
              <>
                <p>
                  Ingrese una nota para cancelar la factura #{cancelInvoice.invoiceNumber}
                </p>
                <Form.Group controlId="cancelNote">
                  <Form.Label>Nota</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={cancelNote}
                    onChange={(e) => setCancelNote(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCancelInvoice(null)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={saveCancellation}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Invoices;

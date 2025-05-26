// src/pages/Invoices.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { all_routes } from "../../Router/all_routes";
import useInvoices from "../../hooks/useInvoices";
import { updateInvoice } from "../../services/invoiceService";
import { getCouriersByProvince } from "../../services/usersService";

// Exportación en lote PNG / PDF
import { generatePNG, generatePDF, chunk } from "../../utils/invoiceExport";

// Exportadores individuales
import InvoicePDFGenerator from "../components/GeneratedImagePdf";
import RealPDFGenerator from "../components/GeneratedPdf";

const Invoices = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // pestañas y paginación
  const [selectedTab, setSelectedTab] = useState("pendiente");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  // datos remotos
  const { invoices, loading, error } = useInvoices();

  // selección múltiple (evita eslint no-unused-vars porque se usa más abajo)
  const [selectedIds, setSelectedIds] = useState(new Set());
  useEffect(() => setSelectedIds(new Set()), [selectedTab]);

  // modales
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [courierSearch, setCourierSearch] = useState("");
  const [selectedCourier, setSelectedCourier] = useState("");
  const [cancelInvoice, setCancelInvoice] = useState(null);
  const [cancelNote, setCancelNote] = useState("");

  // tabs permitidas
  const tabs = [
    { key: "pendiente", label: "Pendientes" },
    { key: "completada", label: "Pagadas" },
    { key: "en_empaquetado", label: "Empaquetado" },
    { key: "cancelada", label: "Canceladas y no entregado" },
    { key: "cancelada_entregado", label: "Canceladas y entregado" },
    { key: "confirmada", label: "Confirmadas" },
    { key: "sinPagar", label: "Sin pagar" },
  ];

  const getId = (o) => (typeof o === "object" && o ? o.id : o);
  const invoiceDocs = Array.isArray(invoices) ? invoices : invoices?.docs || [];

  // -------------------------------- filtrado por rol
  let visibleDocs = invoiceDocs;
  let visibleTabs = tabs;
  if (currentUser.role === "seller") {
    visibleDocs = invoiceDocs.filter(
      (inv) => inv.createdBy && getId(inv.createdBy) === currentUser.id
    );
    visibleTabs = tabs.filter((t) =>
      ["pendiente", "cancelada", "cancelada_entregado"].includes(t.key)
    );
  } else if (currentUser.role === "courier") {
    visibleDocs = invoiceDocs.filter(
      (inv) => inv.assignedCourier && getId(inv.assignedCourier) === currentUser.id
    );
    visibleTabs = tabs.filter((t) =>
      ["en_empaquetado", "completada", "cancelada", "cancelada_entregado"].includes(t.key)
    );
  } else if (currentUser.role === "warehouse") {
    visibleDocs = invoiceDocs.filter((inv) => {
      if (["confirmada", "en_empaquetado"].includes(inv.status.toLowerCase())) return true;
      return inv.assignedCourier && getId(inv.assignedCourier) === currentUser.id;
    });
    visibleTabs = tabs.filter((t) =>
      ["en_empaquetado", "cancelada", "cancelada_entregado", "confirmada"].includes(t.key)
    );
  }

  // -------------------------------- filtrado por pestaña
  const filteredDocs = visibleDocs.filter(
    (inv) => inv.status.toLowerCase() === selectedTab.toLowerCase()
  );
  const totalPages = Math.ceil(filteredDocs.length / pageSize);
  const paginatedInvoices = filteredDocs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ---------- helpers ----------
  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const exportSelectedPNG = async () => {
    for (const batch of chunk([...selectedIds])) {
      await Promise.all(batch.map((id) => generatePNG(id)));
    }
  };

  const exportSelectedPDF = async () => {
    const docs = invoiceDocs.filter((inv) => selectedIds.has(inv.id));
    for (const batch of chunk(docs)) {
      await Promise.all(batch.map((inv) => generatePDF(inv)));
    }
  };

  const changeInvoiceStatus = async (id, status, extra = {}) => {
    try {
      await updateInvoice(id, { status, ...extra });
      window.location.reload();
    } catch (err) {
      console.error("Error al actualizar:", err);
    }
  };

  const openEditModal = async (inv) => {
    setEditingInvoice(inv);
    setSelectedCourier(inv.assignedCourier ? getId(inv.assignedCourier) : "");
    setCourierSearch("");
    try {
      setCouriers(await getCouriersByProvince(inv.province, inv.region));
    } catch (err) {
      console.error("Error couriers:", err);
    }
  };

  const saveCourierAssignment = async () => {
    if (editingInvoice && selectedCourier) {
      await updateInvoice(editingInvoice.id, { assignedCourier: selectedCourier });
      setEditingInvoice(null);
      window.location.reload();
    }
  };

  const openCancelModal = (inv) => {
    setCancelInvoice(inv);
    setCancelNote("");
  };

  const saveCancellation = async () => {
    if (cancelInvoice) {
      await updateInvoice(cancelInvoice.id, { status: "cancelada", cancelNote });
      setCancelInvoice(null);
      window.location.reload();
    }
  };

  const handleEditInvoice = (inv) =>
    navigate(all_routes.invoicecreate, { state: { initialInvoiceData: inv } });

  const filteredCouriers = couriers.filter((c) => {
    const okLoc = editingInvoice?.province?.trim()
      ? c.province === editingInvoice.province
      : c.province === editingInvoice?.region;
    return (
      c.role === "courier" &&
      okLoc &&
      c.email.toLowerCase().includes(courierSearch.toLowerCase())
    );
  });

  // ---------- render ----------
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

        {/* Exportación en lote */}
        <div className="d-flex gap-2 mb-3">
          <Button
            variant="outline-secondary"
            disabled={!selectedIds.size}
            onClick={exportSelectedPNG}
          >
            PNG (5×5)
          </Button>
          <Button
            variant="outline-secondary"
            disabled={!selectedIds.size}
            onClick={exportSelectedPDF}
          >
            PDF (5×5)
          </Button>
        </div>

        {/* Tabs */}
        <nav className="nav nav-style-1 nav-pills mb-3">
          {visibleTabs.map((tab) => (
            <Link
              key={tab.key}
              to="#"
              className={`nav-link ${selectedTab === tab.key ? "active" : ""}`}
              onClick={() => {
                setSelectedTab(tab.key);
                setCurrentPage(1);
              }}
            >
              {tab.label}{" "}
              <span className="badge bg-secondary ms-1 rounded-pill">
                {
                  visibleDocs.filter(
                    (inv) => inv.status.toLowerCase() === tab.key.toLowerCase()
                  ).length
                }
              </span>
            </Link>
          ))}
        </nav>

        {/* Lista de facturas */}
        <div className="tab-content">
          {loading ? (
            <p>Cargando facturas…</p>
          ) : error ? (
            <p>Error al cargar facturas.</p>
          ) : filteredDocs.length === 0 ? (
            <p>No se encontraron facturas para “{selectedTab}”.</p>
          ) : (
            paginatedInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="default-cover p-4 mb-3"
                style={{ position: "relative" }}
              >
                {/* checkbox */}
                <input
                  type="checkbox"
                  style={{ position: "absolute", top: 10, left: 10 }}
                  checked={selectedIds.has(invoice.id)}
                  onChange={(e) => toggleSelect(invoice.id, e.target.checked)}
                />

                <span className="badge bg-secondary d-inline-block mb-4">
                  Order ID : #{invoice.invoiceNumber}
                </span>

                {/* datos */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <table>
                      <tbody>
                        <tr>
                          <td>Emitida</td>
                          <td className="colon">:</td>
                          <td>{invoice.createdBy?.email || "No asignado"}</td>
                        </tr>
                        <tr>
                          <td>Cliente</td>
                          <td className="colon">:</td>
                          <td>{invoice.Client?.name}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6 mb-3">
                    <table>
                      <tbody>
                        <tr>
                          <td>Total</td>
                          <td className="colon">:</td>
                          <td>${invoice.total ?? 0}</td>
                        </tr>
                        <tr>
                          <td>Fecha</td>
                          <td className="colon">:</td>
                          <td>
                            {new Date(invoice.invoiceDate).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6 mb-3">
                    <table>
                      <tbody>
                        <tr>
                          <td>Mensajero</td>
                          <td className="colon">:</td>
                          <td>
                            {invoice.assignedCourier?.email || "No asignado"}
                          </td>
                        </tr>
                        <tr>
                          <td>Estado</td>
                          <td className="colon">:</td>
                          <td>{invoice.status}</td>
                        </tr>
                        <tr>
                          <td>Provincia</td>
                          <td className="colon">:</td>
                          <td>{invoice.province}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* botones individuales */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    display: "flex",
                    gap: 5,
                  }}
                >
                  <InvoicePDFGenerator invoiceId={invoice.id} />
                  <RealPDFGenerator invoice={invoice} />
                </div>

                {/* acciones rápidas (mantengo tu lógica) */}
                <div className="btn-row d-flex align-items-center justify-content-between mt-3">
                  <Link
                    to={all_routes.invoiceview}
                    state={{ initialInvoiceData: invoice }}
                    className="btn btn-info btn-icon flex-fill"
                  >
                    Ver detalles
                  </Link>

                  {invoice.status === "pendiente" && (
                    <>
                      <button
                        className="btn btn-primary btn-icon flex-fill"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-success btn-icon flex-fill"
                        onClick={() => changeInvoiceStatus(invoice.id, "confirmada")}
                      >
                        Confirmar
                      </button>
                      <button
                        className="btn btn-danger btn-icon flex-fill"
                        onClick={() => openCancelModal(invoice)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {invoice.status === "confirmada" && (
                    <>
                      <button
                        className="btn btn-primary btn-icon flex-fill"
                        onClick={() => handleEditInvoice(invoice)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-success btn-icon flex-fill"
                        onClick={() =>
                          changeInvoiceStatus(invoice.id, "en_empaquetado")
                        }
                      >
                        Confirmar Empaquetado
                      </button>
                      <button
                        className="btn btn-danger btn-icon flex-fill"
                        onClick={() => openCancelModal(invoice)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                  {/* Acciones cuando la factura está en empaquetado */}
                  {invoice.status === "en_empaquetado" && (
                    <>
                      {/* si aún no tiene mensajero asignado */}
                      {!invoice.assignedCourier && (
                        <button
                          className="btn btn-success btn-icon flex-fill"
                          onClick={() => openEditModal(invoice)}
                        >
                          Asignar Mensajero
                        </button>
                      )}

                      {/* si el usuario logueado es el mensajero asignado o eres admin */}
                      {(invoice.assignedCourier &&
                        getId(invoice.assignedCourier) === currentUser.id) ||
                        currentUser.role === "admin" ? (
                        <button
                          className="btn btn-success btn-icon flex-fill"
                          onClick={() => changeInvoiceStatus(invoice.id, "completada")}
                        >
                          Completar
                        </button>
                      ) : null}

                      {/* botón cancelar disponible para todos */}
                      <button
                        className="btn btn-danger btn-icon flex-fill"
                        onClick={() => openCancelModal(invoice)}
                      >
                        Cancelar
                      </button>
                    </>
                  )}

                </div>
              </div>
            ))
          )}
        </div>

        {/* paginación */}
        {filteredDocs.length > pageSize && (
          <div className="pagination-controls d-flex justify-content-center align-items-center mb-3">
            <Button
              variant="secondary"
              className="me-2"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
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
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* modal asignar mensajero */}
        <Modal show={!!editingInvoice} onHide={() => setEditingInvoice(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Asignar Mensajero</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingInvoice && (
              <>
                <p>
                  Factura #{editingInvoice.invoiceNumber} –{" "}
                  {editingInvoice.province}
                </p>
                <Form.Group>
                  <Form.Label>Buscar correo</Form.Label>
                  <Form.Control
                    value={courierSearch}
                    onChange={(e) => setCourierSearch(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Mensajero</Form.Label>
                  <Form.Select
                    value={selectedCourier}
                    onChange={(e) => setSelectedCourier(e.target.value)}
                  >
                    <option value="">Seleccione…</option>
                    {filteredCouriers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.email})
                      </option>
                    ))}
                  </Form.Select>
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

        {/* modal cancelar */}
        <Modal show={!!cancelInvoice} onHide={() => setCancelInvoice(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Cancelar Factura</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cancelInvoice && (
              <>
                <p>
                  Nota para cancelar #{cancelInvoice.invoiceNumber}
                </p>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                />
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setCancelInvoice(null)}>
              Cerrar
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

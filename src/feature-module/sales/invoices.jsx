import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip, Modal, Button, Form } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { PlusCircle, RotateCcw } from "feather-icons-react/build/IconComponents";
import { all_routes } from "../../Router/all_routes";
import useInvoices from "../../hooks/useInvoices";
import { updateInvoice } from "../../services/invoiceService";
import { getCouriersByProvince } from "../../services/usersService";

const Invoices = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState("pendiente");
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
    { key: "cancelada", label: "Canceladas" },
    { key: "confirmada", label: "Confirmadas" },
    { key: "sinPagar", label: "Sin pagar" }
  ];

  const getId = (objOrId) =>
    typeof objOrId === "object" && objOrId !== null ? objOrId.id : objOrId;

  const filteredInvoices =
    currentUser.role === "courier"
      ? invoices.filter(
          (invoice) =>
            invoice.assignedCourier &&
            getId(invoice.assignedCourier) === currentUser.id
        )
      : invoices.filter((invoice) => invoice.status === selectedTab);

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
      const fetchedCouriers = await getCouriersByProvince(invoice.province);
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

  const filteredCouriers = couriers.filter(
    (courier) =>
      courier.email.toLowerCase().includes(courierSearch.toLowerCase()) &&
      courier.role === "courier" &&
      courier.province === editingInvoice?.province
  );

  const renderTooltip = (props) => <Tooltip id="pdf-tooltip" {...props}>Pdf</Tooltip>;
  const renderExcelTooltip = (props) => <Tooltip id="excel-tooltip" {...props}>Excel</Tooltip>;
  const renderPrinterTooltip = (props) => <Tooltip id="printer-tooltip" {...props}>Imprimir</Tooltip>;
  const renderRefreshTooltip = (props) => <Tooltip id="refresh-tooltip" {...props}>Refrescar</Tooltip>;
  const renderCreateInvoiceTooltip = (props) => <Tooltip id="create-invoice-tooltip" {...props}>Crear factura</Tooltip>;

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
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link>
                  <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="pdf icon" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link>
                  <ImageWithBasePath src="assets/img/icons/excel.svg" alt="excel icon" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                <Link>
                  <i data-feather="printer" className="feather-printer" />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                <Link>
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderCreateInvoiceTooltip}>
                <Link to={all_routes.invoicecreate}>
                  <PlusCircle />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>

        {/* Mostrar pestañas solo si el usuario NO es mensajero */}
        {currentUser.role !== "courier" && (
          <nav className="nav nav-style-1 nav-pills mb-3" role="tablist">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                className={`nav-link ${selectedTab === tab.key ? "active" : ""}`}
                to="#"
                onClick={() => setSelectedTab(tab.key)}
              >
                {tab.label}{" "}
                <span className="badge bg-secondary ms-1 rounded-pill">
                  {invoices.filter((inv) => inv.status === tab.key).length}
                </span>
              </Link>
            ))}
          </nav>
        )}

        {/* Listado de facturas */}
        <div className="tab-content">
          {loading ? (
            <p>Cargando facturas...</p>
          ) : error ? (
            <p>Error al cargar facturas.</p>
          ) : filteredInvoices.length === 0 ? (
            <p>No se encontraron facturas para el estado &ldquo;{selectedTab}&rdquo;.</p>
          ) : (
            filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="default-cover p-4 mb-3">
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
                <div className="btn-row d-flex align-items-center justify-content-between">
                  <Link to={`${all_routes.invoiceview}/${invoice.id}`} className="btn btn-info btn-icon flex-fill">
                    Ver detalles
                  </Link>

                  {invoice.status === "canceladas" || invoice.status === "pagas" ? null : (
                    <>
                      {invoice.status === "pendiente" && (
                        <>
                          <button
                            onClick={() => handleEditInvoice(invoice)}
                            className="btn btn-primary btn-icon flex-fill"
                          >
                            Editar Factura
                          </button>
                          <button
                            onClick={() => changeInvoiceStatus(invoice.id, "confirmada")}
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => openCancelModal(invoice)}
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {invoice.status === "confirmada" && (
                        <>
                          <button
                            onClick={() => handleEditInvoice(invoice)}
                            className="btn btn-primary btn-icon flex-fill"
                          >
                            Editar Factura
                          </button>
                          <button
                            onClick={() => changeInvoiceStatus(invoice.id, "en_empaquetado")}
                            className="btn btn-success btn-icon flex-fill"
                          >
                            Confirmar Enpaquetado
                          </button>
                          <button
                            onClick={() => openCancelModal(invoice)}
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Cancelar
                          </button>
                        </>
                      )}

                      {invoice.status === "en_empaquetado" && (
                        <>
                          <button
                            onClick={() => handleEditInvoice(invoice)}
                            className="btn btn-primary btn-icon flex-fill"
                          >
                            Editar Factura
                          </button>
                          {!invoice.assignedCourier && (
                            <button
                              onClick={() => openEditModal(invoice)}
                              className="btn btn-success btn-icon flex-fill"
                            >
                              Asignar Mensajero
                            </button>
                          )}
                          {invoice.assignedCourier &&
                            currentUser &&
                            getId(invoice.assignedCourier) === currentUser.id && (
                              <button
                                onClick={() => changeInvoiceStatus(invoice.id, "completada")}
                                className="btn btn-success btn-icon flex-fill"
                              >
                                Completar
                              </button>
                          )}
                          <button
                            onClick={() => openCancelModal(invoice)}
                            className="btn btn-danger btn-icon flex-fill"
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal para asignar mensajero */}
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

        {/* Modal para cancelar factura */}
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

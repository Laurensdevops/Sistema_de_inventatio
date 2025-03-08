import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Table, Form, Button, Card, Row, Col } from "react-bootstrap";
import Breadcrumbs from "../../core/breadcrumbs";
import useInvoices from "../../hooks/useInvoices";
import useUsers from "../../hooks/useUsers";
import { all_routes } from "../../Router/all_routes";
import { updateInvoice } from "../../services/invoiceService";
import { Eye, DollarSign } from "react-feather";

// Genera las opciones para el select de usuarios (vendedores y mensajeros)
const userOptions = (users) => {
  return [
    { value: "", label: "Mostrar todos" },
    ...users
      .filter((user) => user.role === "seller" || user.role === "courier")
      .map((user) => ({
        value: user.id || user._id,
        label:
          (user.role === "seller" ? "Vendedor: " : "Mensajero: ") + user.email,
        role: user.role,
      })),
  ];
};

// Función auxiliar para obtener el ID del usuario (ya sea en "id" o "_id")
const getUserId = (user) => {
  if (!user) return null;
  return user.id || user._id || null;
};

const InvoiceReport = () => {
  const { invoices, loading, error } = useInvoices();
  const { users, loading: usersLoading } = useUsers();
  const [searchText, setSearchText] = useState("");

  // Filtros de fecha: por defecto se muestran los últimos 7 días
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(sevenDaysAgoStr);
  const [endDate, setEndDate] = useState(todayStr);

  // Filtro único para usuario (admin/manager)
  const [selectedUser, setSelectedUser] = useState("");

  // Usuario actual
  const currentUser = JSON.parse(localStorage.getItem("user"));

  // Si la data viene con paginación, usamos invoices.docs; de lo contrario, asumimos que invoices es un array.
  const invoiceDocs = Array.isArray(invoices)
    ? invoices
    : (invoices && invoices.docs) || [];

  // Filtrado por fecha: se incluyen aquellas facturas cuya invoiceDate esté entre startDate y endDate.
  const dateFilteredInvoices = invoiceDocs.filter((invoice) => {
    const invDate = new Date(invoice.invoiceDate);
    return (
      invDate >= new Date(startDate) &&
      invDate <= new Date(endDate + "T23:59:59")
    );
  });

  // Filtrado por búsqueda (por número de factura o nombre del cliente)
  const searchFilteredInvoices = dateFilteredInvoices.filter((invoice) => {
    const invoiceNum = invoice.invoiceNumber.toLowerCase();
    const clientName = invoice.Client?.name.toLowerCase() || "";
    return (
      invoiceNum.includes(searchText.toLowerCase()) ||
      clientName.includes(searchText.toLowerCase())
    );
  });

  // Filtrado según rol:
  // - Si es seller: muestra solo facturas creadas por él.
  // - Si es courier: muestra solo facturas asignadas a él.
  // - Si es admin/manager: si se selecciona un usuario, filtra según el rol del usuario seleccionado.
  let visibleDocs = searchFilteredInvoices;
  if (currentUser.role === "seller") {
    visibleDocs = visibleDocs.filter(
      (invoice) => getUserId(invoice.createdBy) === getUserId(currentUser)
    );
  } else if (currentUser.role === "courier") {
    visibleDocs = visibleDocs.filter(
      (invoice) => getUserId(invoice.assignedCourier) === getUserId(currentUser)
    );
  } else if (["admin", "manager"].includes(currentUser.role)) {
    if (selectedUser) {
      const selectedUserObj = users.find(
        (user) => getUserId(user) === selectedUser
      );
      if (selectedUserObj) {
        if (selectedUserObj.role === "seller") {
          visibleDocs = visibleDocs.filter(
            (invoice) => getUserId(invoice.createdBy) === selectedUser
          );
        } else if (selectedUserObj.role === "courier") {
          visibleDocs = visibleDocs.filter(
            (invoice) => getUserId(invoice.assignedCourier) === selectedUser
          );
        }
      }
    }
  }

  // Paginación: 10 facturas por página
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(visibleDocs.length / pageSize);
  const paginatedInvoices = visibleDocs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Función para calcular la comisión (aplicada sobre el total de la factura)
  const calculateCommission = (invoice) => {
    if (!invoice.items || invoice.items.length === 0) return 0;
    const totalQuantity = invoice.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    let rate = 0;
    if (totalQuantity >= 1 && totalQuantity <= 5) rate = 0.25;
    else if (totalQuantity >= 6 && totalQuantity <= 11) rate = 0.20;
    else if (totalQuantity >= 12) rate = 0.15;
    return invoice.total * rate;
  };

  const getCommissionPercent = (invoice) => {
    if (!invoice.items || invoice.items.length === 0) return "";
    const totalQuantity = invoice.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    if (totalQuantity >= 1 && totalQuantity <= 5) return "25%";
    else if (totalQuantity >= 6 && totalQuantity <= 11) return "20%";
    else if (totalQuantity >= 12) return "15%";
    return "";
  };

  // Resumen global de comisión pendiente (solo para admin/manager)
  const totalPendingCommissionSeller = visibleDocs.reduce((acc, invoice) => {
    if (!invoice.commissionPaidToSeller) {
      return acc + calculateCommission(invoice);
    }
    return acc;
  }, 0);
  const totalPendingCommissionCourier = visibleDocs.reduce((acc, invoice) => {
    if (!invoice.commissionPaidToCourier) {
      return acc + calculateCommission(invoice);
    }
    return acc;
  }, 0);

  // Función para marcar la comisión como pagada (solo para admin/manager)
  const handlePayCommission = async (invoice) => {
    try {
      const selectedUserObj = users.find(
        (user) => getUserId(user) === selectedUser
      );
      if (!selectedUserObj) return;
      let updateData = {};
      if (selectedUserObj.role === "seller") {
        updateData = { commissionPaidToSeller: true };
      } else if (selectedUserObj.role === "courier") {
        updateData = { commissionPaidToCourier: true };
      }
      await updateInvoice(invoice.id, updateData);
      window.location.reload();
    } catch (error) {
      console.error("Error al pagar la comisión:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <Breadcrumbs
          maintitle="Invoice Report"
          subtitle="Reporte de Facturas y Comisiones"
        />

        {/* Filtros de búsqueda y fechas */}
        <div className="row mb-3">
          <div className="col-md-4 col-12 mb-2">
            <input
              type="text"
              placeholder="Buscar factura o cliente..."
              className="form-control"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-md-3 col-12 mb-2">
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="col-md-3 col-12 mb-2">
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Filtro adicional para admin/manager: select único para filtrar por usuario */}
        {["admin", "manager"].includes(currentUser.role) && !usersLoading && (
          <div className="row mb-3">
            <div className="col-md-4 col-12 mb-2">
              <Form.Control
                as="select"
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {userOptions(users).map((option) => (
                  <option key={option.value || "all"} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Form.Control>
            </div>
          </div>
        )}

        {/* Resumen de comisión pendiente (solo para admin/manager) */}
        {["admin", "manager"].includes(currentUser.role) && (
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Row>
                <Col md={6} className="mb-3 mb-md-0">
                  <h6 className="mb-1 text-primary">
                    Comisión pendiente para Vendedor
                  </h6>
                  <h4 className="mb-0">${totalPendingCommissionSeller.toFixed(2)}</h4>
                </Col>
                <Col md={6}>
                  <h6 className="mb-1 text-success">
                    Comisión pendiente para Mensajero
                  </h6>
                  <h4 className="mb-0">${totalPendingCommissionCourier.toFixed(2)}</h4>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}

        {loading ? (
          <p>Cargando facturas...</p>
        ) : error ? (
          <p>Error al cargar facturas.</p>
        ) : visibleDocs.length === 0 ? (
          <p>No se encontraron facturas en este rango.</p>
        ) : (
          <>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Número de Factura</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total Factura</th>
                  <th>Comisión (%)</th>
                  <th>Monto Comisión</th>
                  <th>Estado Comisión</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInvoices.map((invoice) => {
                  const commissionPercent = getCommissionPercent(invoice);
                  const commissionAmount = calculateCommission(invoice);
                  let commissionStatus = "";
                  // Se determina el estado de comisión según el usuario filtrado en el select
                  if (invoice.items && invoice.items.length > 0) {
                    if (getUserId(invoice.createdBy) === selectedUser) {
                      commissionStatus = invoice.commissionPaidToSeller ? "Pagada" : "No Pagada";
                    } else if (getUserId(invoice.assignedCourier) === selectedUser) {
                      commissionStatus = invoice.commissionPaidToCourier ? "Pagada" : "No Pagada";
                    } else {
                      commissionStatus = "N/A";
                    }
                  }
                  return (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNumber}</td>
                      <td>{invoice.Client ? invoice.Client.name : "No asignado"}</td>
                      <td>{new Date(invoice.invoiceDate).toLocaleDateString()}</td>
                      <td>${invoice.total}</td>
                      <td>{commissionPercent}</td>
                      <td>${commissionAmount.toFixed(2)}</td>
                      <td>{commissionStatus}</td>
                      <td>
                        <Link
                          to={all_routes.invoiceview}
                          state={{ initialInvoiceData: invoice }}
                          className="btn btn-info btn-sm"
                        >
                          <Eye size={16} />
                        </Link>
                        {["admin", "manager"].includes(currentUser.role) &&
                          selectedUser &&
                          commissionStatus === "No Pagada" && (
                            <Button
                              variant="success"
                              size="sm"
                              className="ml-2"
                              onClick={() => handlePayCommission(invoice)}
                            >
                              <DollarSign size={16} />
                            </Button>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {visibleDocs.length > pageSize && (
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
          </>
        )}
      </div>
    </div>
  );
};

export default InvoiceReport;

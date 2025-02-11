import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, RotateCcw } from "feather-icons-react/build/IconComponents";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import useProducts from "../../hooks/useProducts";       // Obtiene todos los productos
import useCategories from "../../hooks/useCategories";   // Obtiene las categorías

// Importa los servicios para cliente y factura
import { getClientByEmail, createClient } from "../../services/clientService";
import { createInvoice } from "../../services/invoiceService";

// Función de ayuda para determinar el precio aplicado según la cantidad
const getAppliedPrice = (prices, quantity) => {
  if (quantity === 1) return prices.base;
  if (quantity >= 2 && quantity < 10) return prices.wholesale;
  return prices.retail;
};

const InvoiceCreate = () => {
  // Estados para la factura y los datos del cliente
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");

  // Estado para la categoría seleccionada y paginación
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Mostrar 3 productos por página

  // Obtención de productos y categorías
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: catLoading, error: catError } = useCategories();

  // Si las categorías se cargan y no hay ninguna seleccionada, seleccionamos la primera
  useEffect(() => {
    if (!selectedCategory && categories && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Extraer el array completo de productos (según el hook)
  const allProducts =
    products && products.docs
      ? products.docs
      : Array.isArray(products)
      ? products
      : [];

  // Filtrar productos según la categoría seleccionada.
  // Ajusta la condición según la estructura de tus datos:
  // Si cada producto tiene la propiedad "category" (string) que coincide con el _id de la categoría:
  const filteredProducts = selectedCategory
    ? allProducts.filter(
        (product) => product.category === selectedCategory._id
      )
    : [];

  // Reiniciamos la página a 1 cuando cambia la categoría
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Paginación local sobre el array filtrado
  const totalFiltered = filteredProducts.length;
  const totalPages = Math.ceil(totalFiltered / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Función para agregar un producto a la factura, incluyendo el precio aplicado
  const addProductToInvoice = (product) => {
    setInvoiceItems((prevItems) => {
      const exists = prevItems.find(
        (item) => item.productId === (product.id || product._id)
      );
      if (exists) {
        return prevItems.map((item) =>
          item.productId === (product.id || product._id)
            ? {
                ...item,
                quantity: item.quantity + 1,
                appliedPrice: getAppliedPrice(item.prices, item.quantity + 1),
              }
            : item
        );
      }
      return [
        ...prevItems,
        {
          productId: product.id || product._id,
          productName: product.name,
          quantity: 1,
          stock: product.stock,
          image: product.image,
          prices: product.prices, // Guarda el grupo de precios
          appliedPrice: getAppliedPrice(product.prices, 1),
        },
      ];
    });
  };

  // Funciones para actualizar la cantidad y eliminar items
  const handleQuantityChange = (productId, newQty) => {
    setInvoiceItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQty, appliedPrice: getAppliedPrice(item.prices, newQty) }
          : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setInvoiceItems((prevItems) =>
      prevItems.filter((item) => item.productId !== productId)
    );
  };

  // Funciones de tooltip
  const renderTooltip = (props) => (<Tooltip id="pdf-tooltip" {...props}>Pdf</Tooltip>);
  const renderExcelTooltip = (props) => (<Tooltip id="excel-tooltip" {...props}>Excel</Tooltip>);
  const renderPrinterTooltip = (props) => (<Tooltip id="printer-tooltip" {...props}>Imprimir</Tooltip>);
  const renderRefreshTooltip = (props) => (<Tooltip id="refresh-tooltip" {...props}>Refrescar</Tooltip>);
  const renderCreateInvoiceTooltip = (props) => (<Tooltip id="create-invoice-tooltip" {...props}>Crear factura</Tooltip>);

  // Función para enviar la factura
  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Verificar si el cliente existe (por email, por ejemplo)
      const clientRes = await getClientByEmail(clientEmail);
      let client;
      if (clientRes.docs && clientRes.docs.length > 0) {
        client = clientRes.docs[0];
      } else {
        // 2. Si no existe, crearlo
        client = await createClient({
          name: clientName,
          phone: clientPhone,
          email: clientEmail,
          address: clientAddress,
        });
      }

      // 3. Construir los datos de la factura
      const invoiceData = {
        invoiceNumber: "F12345", // Genera o ingresa el número de factura según tu lógica
        Client: client.id || client._id,
        invoiceDate: new Date().toISOString(), // Puedes usar un campo de fecha del formulario
        issuedBy: "UsuarioActual", // Ajusta según el usuario actual
        status: "tomada", // O el estado que corresponda
        items: invoiceItems.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
        })),
        notes: "",
      };

      // 4. Crear la factura
      await createInvoice(invoiceData);
      console.log("Factura creada exitosamente");

      // Opcional: limpiar los formularios, reiniciar estados, o redirigir
    } catch (error) {
      console.error("Error al crear factura:", error);
    }
  };

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
                <Link to="#" data-bs-toggle="modal" data-bs-target="#orders">
                  <PlusCircle />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
        </div>

        {/* Sección de datos del cliente */}
        <div className="card mb-3">
          <div className="card-body">
            <h5>Información del Cliente</h5>
            <div className="row">
              <div className="col-md-3">
                <label>Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label>Teléfono</label>
                <input
                  type="text"
                  className="form-control"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <label>Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Formulario de la factura (Productos agregados) */}
        <form onSubmit={handleInvoiceSubmit}>
          <div className="card mb-3">
            <div className="card-body">
              <h5>Productos de la Factura</h5>
              <div className="table-responsive">
                <table className="table text-nowrap table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad</th>
                      <th>Precio Aplicado</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.productId}>
                        <td>{item.productName}</td>
                        <td>
                          <input
                            type="number"
                            value={item.quantity}
                            min="1"
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productId,
                                parseInt(e.target.value, 10)
                              )
                            }
                          />
                        </td>
                        <td>{item.appliedPrice}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => handleRemoveItem(item.productId)}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                    {invoiceItems.length === 0 && (
                      <tr>
                        <td colSpan="4">No se han agregado productos.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="btn-addproduct mb-4">
                <button type="button" className="btn btn-cancel me-2">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-submit">
                  Guardar Factura
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal para seleccionar productos */}
        <div className="modal fade pos-modal" id="orders" tabIndex={-1} aria-hidden="true">
          <div className="modal-dialog modal-md modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header p-4">
                <h5 className="modal-title">Agregar Producto</h5>
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body p-4">
                {/* Render de pestañas con las categorías dinámicas */}
                {catLoading ? (
                  <p>Cargando categorías...</p>
                ) : catError ? (
                  <p>Error al cargar categorías.</p>
                ) : categories.length === 0 ? (
                  <p>No hay categorías disponibles.</p>
                ) : (
                  <div className="tabs-sets">
                    <ul className="nav nav-tabs" id="productTabs" role="tablist">
                      {categories.map((cat) => (
                        <li className="nav-item" role="presentation" key={cat._id}>
                          <button
                            className={`nav-link ${selectedCategory && selectedCategory._id === cat._id ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat)}
                            type="button"
                            role="tab"
                          >
                            {cat.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Lista de productos filtrados y paginados */}
                <div className="mt-3">
                  {selectedCategory === null ? (
                    <p>Seleccione una categoría para ver sus productos.</p>
                  ) : productsLoading ? (
                    <p>Cargando productos...</p>
                  ) : productsError ? (
                    <p>Error al cargar productos.</p>
                  ) : filteredProducts.length === 0 ? (
                    <p>No hay productos para esta categoría.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table text-nowrap table-striped table-hover">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Stock</th>
                            <th>Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedProducts.map((product) => (
                            <tr key={product.id || product._id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2 avatar-rounded">
                                    <ImageWithBasePath
                                      src={product.image || "assets/img/avatar/avatar-15.jpg"}
                                      alt="Producto"
                                      className="rounded-circle"
                                    />
                                  </div>
                                  <div>
                                    <div className="lh-1">
                                      <span>{product.name}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td>{product.stock}</td>
                              <td>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary"
                                  onClick={() => {
                                    addProductToInvoice(product);
                                    // Cerrar el modal si window.bootstrap está definido
                                    const modalEl = document.getElementById("orders");
                                    if (modalEl && window.bootstrap && window.bootstrap.Modal) {
                                      const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                                      if (modalInstance) modalInstance.hide();
                                    }
                                  }}
                                >
                                  Agregar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {/* Controles de paginación */}
                      <div className="pagination-controls d-flex justify-content-center align-items-center mt-3">
                        <button 
                          className="btn btn-secondary me-2" 
                          disabled={currentPage <= 1} 
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Anterior
                        </button>
                        <span>
                          Página {currentPage} de {totalPages}
                        </span>
                        <button 
                          className="btn btn-secondary ms-2" 
                          disabled={currentPage >= totalPages} 
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Siguiente
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Fin del Modal para seleccionar productos */}
      </div>
    </div>
  );
};

export default InvoiceCreate;

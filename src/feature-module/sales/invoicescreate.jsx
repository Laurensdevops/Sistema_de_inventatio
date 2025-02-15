import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";
import { OverlayTrigger, Tooltip, Modal, Button} from "react-bootstrap";
import { PlusCircle, RotateCcw } from "feather-icons-react/build/IconComponents";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import useProducts from "../../hooks/useProducts";
import useCategories from "../../hooks/useCategories";

import { getClientByPhone, getClientByEmail, createClient } from "../../services/clientService";
import { createInvoice, updateInvoice } from "../../services/invoiceService";

const regionsData = [
  { name: "Santo Domingo", provinces: [] },
  {
    name: "Región Este",
    provinces: [
      { name: "La Altagracia", tariff: 300 },
      { name: "El Seibo", tariff: 320 },
      { name: "Hato Mayor", tariff: 280 },
      { name: "La Romana", tariff: 350 }
    ]
  },
  {
    name: "Región Norte",
    provinces: [
      { name: "Puerto Plata", tariff: 400 },
      { name: "Santiago", tariff: 380 },
      { name: "Duarte", tariff: 360 },
      { name: "Samaná", tariff: 350 },
      { name: "La Vega", tariff: 370 },
      { name: "María Trinidad Sánchez", tariff: 360 },
      { name: "Santiago Rodríguez", tariff: 340 }
    ]
  },
  {
    name: "Región Sur",
    provinces: [
      { name: "Barahona", tariff: 320 },
      { name: "San Juan", tariff: 310 },
      { name: "Bahoruco", tariff: 300 },
      { name: "Peravia", tariff: 290 },
      { name: "Azua", tariff: 280 },
      { name: "San Cristóbal", tariff: 270 },
      { name: "Monte Plata", tariff: 260 }
    ]
  },
  {
    name: "Región Centro",
    provinces: [
      { name: "Valverde", tariff: 250 },
      { name: "Sánchez Ramírez", tariff: 240 },
      { name: "Monseñor Nouel", tariff: 230 },
      { name: "Hermanas Mirabal", tariff: 220 }
    ]
  }
];

const getAppliedPrice = (prices, quantity) => {
  if (!prices) return "Precio 1";
  if (quantity >= 1 && quantity <= 5) return "Precio 1";
  if (quantity >= 6 && quantity <= 11) return "Precio 2";
  if (quantity >= 12) return "Precio 3";
  return "Precio 1";
};

const InvoiceCreate = ({ initialInvoiceData = null }) => {
  const location = useLocation();
  const editingData = location.state?.initialInvoiceData || initialInvoiceData;
  const isEditing = editingData !== null;

  const [invoiceItems, setInvoiceItems] = useState([]);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const [selectedRegion, setSelectedRegion] = useState(regionsData[0]);
  const [selectedProvince, setSelectedProvince] = useState(
    regionsData[0].provinces.length > 0 ? regionsData[0].provinces[0] : null
  );
  const [customTariff, setCustomTariff] = useState(
    selectedProvince ? selectedProvince.tariff : ""
  );

  const [productModalOpen, setProductModalOpen] = useState(false);

  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: catLoading, error: catError } = useCategories();

  useEffect(() => {
    if (!selectedCategory && categories && categories.length > 0) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  useEffect(() => {
    if (isEditing && editingData) {
      setInvoiceItems(
        editingData.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          stock: item.stock,
          image: item.image,
          prices: item.prices,
          appliedPrice: getAppliedPrice(item.prices, item.quantity)
        }))
      );
      setClientName(editingData.Client?.name || "");
      setClientPhone(editingData.Client?.phone || "");
      setClientEmail(editingData.Client?.email || "");
      setClientAddress(editingData.Client?.address || "");
      setPaymentMethod(editingData.paymentMethod || "efectivo");

      if (editingData.region) {
        const regionFound = regionsData.find((r) => r.name === editingData.region);
        if (regionFound) {
          setSelectedRegion(regionFound);
          if (editingData.province && regionFound.provinces.length > 0) {
            const provFound = regionFound.provinces.find((p) => p.name === editingData.province);
            setSelectedProvince(provFound || regionFound.provinces[0]);
            setCustomTariff(provFound ? provFound.tariff : regionFound.provinces[0].tariff);
          }
        }
      }
    }
  }, [isEditing, editingData]);

  const currentCategory = useMemo(() => {
    return selectedCategory || (categories && categories.length > 0 ? categories[0] : null);
  }, [selectedCategory, categories]);

  const allProducts =
    products && products.docs
      ? products.docs
      : Array.isArray(products)
      ? products
      : [];

  const filteredProducts = currentCategory
    ? allProducts.filter((product) => {
        if (Array.isArray(product.categories)) {
          return product.categories.some((cat) => {
            if (typeof cat === "string") {
              return cat === currentCategory.id;
            }
            return cat.id === currentCategory.id;
          });
        }
        return false;
      })
    : [];

  useEffect(() => {
    setCurrentPage(1);
  }, [currentCategory]);

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const addProductToInvoice = (product) => {
    setInvoiceItems((prevItems) => {
      const exists = prevItems.find((item) => item.productId === product.id);
      if (exists) {
        return prevItems.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                appliedPrice: getAppliedPrice(item.prices, item.quantity + 1)
              }
            : item
        );
      }
      return [
        ...prevItems,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          stock: product.stock,
          image: product.image,
          prices: product.prices,
          appliedPrice: getAppliedPrice(product.prices, 1)
        }
      ];
    });
    setProductModalOpen(false);
  };

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

  useEffect(() => {
    if (!isEditing && clientPhone && clientPhone.length >= 4) {
      const fetchClientByPhone = async () => {
        try {
          const res = await getClientByPhone(clientPhone);
          if (res.docs && res.docs.length > 0) {
            const client = res.docs[0];
            setClientName(client.name || "");
            setClientEmail(client.email || "");
            setClientAddress(client.address || "");
            setPaymentMethod(client.paymentMethod || "");
          }
        } catch (error) {
          console.error("Error al buscar cliente por teléfono:", error);
        }
      };
      fetchClientByPhone();
    }
  }, [clientPhone, isEditing]);

  useEffect(() => {
    if (selectedRegion && selectedRegion.provinces.length > 0) {
      setSelectedProvince(selectedRegion.provinces[0]);
      setCustomTariff(selectedRegion.provinces[0].tariff);
    } else {
      setSelectedProvince(null);
      setCustomTariff("");
    }
  }, [selectedRegion]);

  const renderTooltip = (props) => (<Tooltip id="pdf-tooltip" {...props}>Pdf</Tooltip>);
  const renderExcelTooltip = (props) => (<Tooltip id="excel-tooltip" {...props}>Excel</Tooltip>);
  const renderPrinterTooltip = (props) => (<Tooltip id="printer-tooltip" {...props}>Imprimir</Tooltip>);
  const renderRefreshTooltip = (props) => (<Tooltip id="refresh-tooltip" {...props}>Refrescar</Tooltip>);
  const renderCreateInvoiceTooltip = (props) => (<Tooltip id="create-invoice-tooltip" {...props}>{isEditing ? "Editar factura" : "Crear factura"}</Tooltip>);

  const getOrCreateClient = async () => {
    let client = null;
    if (clientPhone) {
      const resPhone = await getClientByPhone(clientPhone);
      if (resPhone.docs && resPhone.docs.length > 0) {
        client = resPhone.docs[0];
      }
    }
    if (!client && clientEmail) {
      const resEmail = await getClientByEmail(clientEmail);
      if (resEmail.docs && resEmail.docs.length > 0) {
        client = resEmail.docs[0];
      }
    }
    if (!client) {
      client = await createClient({
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
        address: clientAddress,
        paymentMethod: paymentMethod
      });
    }
    return client;
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const client = await getOrCreateClient();
      const generateInvoiceNumber = () => `F-${new Date().getTime()}`;
      const getPriceValue = (item) => {
        if (!item.prices) return 0;
        if (item.appliedPrice === "Precio 1") return item.prices.base;
        if (item.appliedPrice === "Precio 2") return item.prices.wholesale;
        if (item.appliedPrice === "Precio 3") return item.prices.retail;
        return item.prices.base;
      };
      const invoiceData = {
        invoiceNumber: isEditing ? editingData.invoiceNumber : generateInvoiceNumber(),
        Client: client._id || client.id,
        invoiceDate: new Date().toISOString(),
        status: isEditing ? editingData.status : "pendiente",
        items: invoiceItems.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: getPriceValue(item)
        })),
        region: selectedRegion.name,
        province: selectedProvince ? selectedProvince.name : "",
        paymentMethod,
        tariff: customTariff,
        notes: ""
      };
      if (isEditing) {
        await updateInvoice(editingData.id, invoiceData);
        console.log("Factura actualizada exitosamente");
      } else {
        await createInvoice(invoiceData);
        console.log("Factura creada exitosamente");
      }
    } catch (error) {
      console.error("Error al enviar la factura:", error);
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
              <h6>{isEditing ? "Editar factura" : "Crear factura"}</h6>
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
                <Link to="#" onClick={() => setProductModalOpen(true)}>
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
              <div className="col-md-3 mt-3">
                <label>Método de Pago</label>
                <select
                  className="form-control"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Campos para Región, Provincia y Tarifa */}
        <div className="card mb-3">
          <div className="card-body">
            <h5>Ubicación</h5>
            <div className="row">
              <div className="col-md-4">
                <label>Región</label>
                <select
                  className="form-control"
                  value={selectedRegion.name}
                  onChange={(e) => {
                    const region = regionsData.find(r => r.name === e.target.value);
                    setSelectedRegion(region);
                    if (region.provinces.length > 0) {
                      setSelectedProvince(region.provinces[0]);
                      setCustomTariff(region.provinces[0].tariff);
                    } else {
                      setSelectedProvince(null);
                      setCustomTariff("");
                    }
                  }}
                >
                  {regionsData.map((region) => (
                    <option key={region.name} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                {selectedRegion && selectedRegion.provinces.length > 0 && (
                  <>
                    <label>Provincia</label>
                    <select
                      className="form-control"
                      value={selectedProvince ? selectedProvince.name : ""}
                      onChange={(e) => {
                        const prov = selectedRegion.provinces.find(p => p.name === e.target.value);
                        setSelectedProvince(prov);
                        setCustomTariff(prov ? prov.tariff : "");
                      }}
                    >
                      <option value="">Seleccione una provincia</option>
                      {selectedRegion.provinces.map((prov) => (
                        <option key={prov.name} value={prov.name}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </div>
              <div className="col-md-4">
                {selectedRegion && selectedRegion.provinces.length > 0 && (
                  <>
                    <label>Tarifa</label>
                    <input
                      type="number"
                      className="form-control"
                      value={customTariff}
                      onChange={(e) => setCustomTariff(e.target.value)}
                    />
                  </>
                )}
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
              <div className="btn-addproduct mb-2 mt-3">
                <button type="submit" className="btn btn-submit">
                  {isEditing ? "Actualizar Factura" : "Guardar Factura"}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Modal para seleccionar productos */}
        <Modal
          show={productModalOpen}
          onHide={() => setProductModalOpen(false)}
          dialogClassName="modal-md modal-dialog-centered"
        >
          <Modal.Header closeButton>
            <Modal.Title>Agregar Producto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {catLoading ? (
              <p>Cargando categorías...</p>
            ) : catError ? (
              <p>Error al cargar categorías.</p>
            ) : !categories || categories.length === 0 ? (
              <p>No hay categorías disponibles.</p>
            ) : (
              <div className="tabs-sets">
                <ul className="nav nav-tabs" id="productTabs" role="tablist">
                  {categories.map((cat) => (
                    <li className="nav-item" role="presentation" key={cat.id}>
                      <button
                        className={`nav-link ${currentCategory && currentCategory.id === cat.id ? "active" : ""}`}
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
            <div className="mt-3">
              {currentCategory === null ? (
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
                        <tr key={product.id}>
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
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                addProductToInvoice(product);
                              }}
                            >
                              Agregar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination-controls d-flex justify-content-center align-items-center mt-3">
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
                </div>
              )}
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
};

InvoiceCreate.propTypes = {
  initialInvoiceData: PropTypes.object, 
};

export default InvoiceCreate;

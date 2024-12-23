import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";

import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
  RotateCcw,
  ChevronDown,
  Info,
  PlusCircle
} from "feather-icons-react/build/IconComponents";

const InvoiceCreate = () => {
  const route = all_routes;
  const renderTooltip = (props) => (
    <Tooltip id="pdf-tooltip" {...props}>
      Pdf
    </Tooltip>
  );
  const renderExcelTooltip = (props) => (
    <Tooltip id="excel-tooltip" {...props}>
      Excel
    </Tooltip>
  );
  const renderPrinterTooltip = (props) => (
    <Tooltip id="printer-tooltip" {...props}>
      Imprumir
    </Tooltip>
  );
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refrescar
    </Tooltip>
  );
  const renderCreateInvoiceTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Crear factura
    </Tooltip>
  );
  return (
    <div>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4> Facturas </h4>
                <h6>Crear y manejar facturas</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <OverlayTrigger placement="top" overlay={renderTooltip}>
                  <Link>
                    <ImageWithBasePath
                      src="assets/img/icons/pdf.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <ImageWithBasePath
                      src="assets/img/icons/excel.svg"
                      alt="img"
                    />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderPrinterTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <i data-feather="printer" className="feather-printer" />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderRefreshTooltip}>
                  <Link data-bs-toggle="tooltip" data-bs-placement="top">
                    <RotateCcw />
                  </Link>
                </OverlayTrigger>
              </li>
              <li>
                <OverlayTrigger placement="top" overlay={renderCreateInvoiceTooltip}>
                  <Link to={route.addproduct} data-bs-toggle="tooltip" data-bs-placement="top">
                    <PlusCircle />
                  </Link>
                </OverlayTrigger>
              </li>
            </ul>
          </div>
          <form>
            <div className="card">
              <div className="card-body add-product pb-0">
                <div
                  className="accordion-card-one accordion"
                  id="accordionExample"
                >
                  <div className="accordion-item">
                    <div className="accordion-header" id="headingOne">
                      <div
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-controls="collapseOne"
                      >
                        <div className="addproduct-icon">
                          <h5>
                            <Info className="add-info" />

                            <span>Informacion del producto</span>
                          </h5>
                          <Link to="#">
                            <ChevronDown className="chevron-down-add" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        <div className="addservice-info">
                          <div className="btn-row mb-10 d-sm-flex align-items-center">
                            <div className="btn-row d-sm-flex align-items-center">
                              <Link
                                to="#"
                                className="btn btn-secondary"
                                data-bs-toggle="modal"
                                data-bs-target="#orders"
                              >
                                <span className="me-1 d-flex align-items-center">
                                  <PlusCircle className="feather-16" />
                                </span>

                              </Link>
                            </div>
                          </div>

                          <div className="col-xl-12">
                            <div className="card">
                              <div className="card-body">
                                <div className="table-responsive">
                                  <table className="table text-nowrap table-striped table-hover">
                                    <thead>
                                      <tr>
                                        <th scope="col">SKU</th>
                                        <th scope="col">Product</th>
                                        <th scope="col">Stock</th>
                                        <th scope="col">Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <th scope="row">IN-2032</th>
                                        <td>
                                          <div className="d-flex align-items-center">
                                            <div className="avatar avatar-sm me-2 avatar-rounded">
                                              <ImageWithBasePath
                                                src="assets/img/avatar/avatar-15.jpg"
                                                alt="img"
                                              />
                                            </div>
                                            <div>
                                              <div className="lh-1">
                                                <span>Plancha a vapor</span>
                                              </div>
                                              <div className="lh-1">
                                                <span className="fs-11 text-muted">
                                                  hola mundo
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="col-lg-4 col-sm-6 col-12">
                                            <div className="input-group">
                                              <input
                                                type="number"
                                                className="form-control"
                                                aria-label=""
                                              />
                                            </div>
                                          </div>
                                        </td>
                                        <td>
                                          <button className="btn btn-sm btn-danger btn-wave waves-effect waves-light">
                                            <i className="feather-trash align-middle me-2 d-inline-block" />
                                            Delete
                                          </button>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <form>
            <div className="card">
              <div className="card-body add-product pb-0">
                <div
                  className="accordion-card-one accordion"
                  id="accordionClient"
                >
                  <div className="accordion-item">
                    <div className="accordion-header" id="headingOne">
                      <div
                        className="accordion-button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo"
                        aria-controls="collapseTwo"
                      >
                        <div className="addproduct-icon">
                          <h5>
                            <Info className="add-info" />

                            <span>Informacion del cliente </span>
                          </h5>
                          <Link to="#">
                            <ChevronDown className="chevron-down-add" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div
                      id="collapseTwo"
                      className="accordion-collapse collapse show"
                      aria-labelledby="headingOne"
                      data-bs-parent="#accordionClient"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Nombre cliente</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Apellido cliente</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Telefono</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                        </div>
                        <div className="addservice-info">
                          <div className="row">
                            <div className="col-lg-4 col-sm-6 col-12">
                              <div className="mb-3 add-product">
                                <label className="form-label">Direccion</label>
                                <input type="text" className="form-control" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="btn-addproduct mb-4">
                <button type="button" className="btn btn-cancel me-2">
                  Cancelar
                </button>
                <Link to={route.addproduct} className="btn me-2 btn-submit">
                  Generear facturar
                </Link>
                <Link to={route.addproduct} className="btn btn-submit">
                  Guardar
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        className="modal fade pos-modal"
        id="orders"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-md modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">agregar producto</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-4">
              <div className="tabs-sets">
                <ul className="nav nav-tabs" id="myTabs" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="onhold-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#onhold"
                      type="button"
                      aria-controls="onhold"
                      aria-selected="true"
                      role="tab"
                    >
                      Hogar
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="unpaid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#unpaid"
                      type="button"
                      aria-controls="unpaid"
                      aria-selected="false"
                      role="tab"
                    >
                      Cocina
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="paid-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#paid"
                      type="button"
                      aria-controls="paid"
                      aria-selected="false"
                      role="tab"
                    >
                      Electrodomesticos
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="onhold"
                    role="tabpanel"
                    aria-labelledby="onhold-tab"
                  >
                    <div>
                      Hogar
                    </div>
                  </div>
                  <div className="tab-pane fade" id="unpaid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div>
                      Cosina
                    </div>
                  </div>
                  <div className="tab-pane fade" id="paid" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set w-100 search-order">
                        <div className="search-input w-100">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch w-100"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div>
                      Electrodomesticos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreate;

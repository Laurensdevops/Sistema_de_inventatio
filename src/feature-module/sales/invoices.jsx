import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { PlusCircle } from 'feather-icons-react/build/IconComponents'
import { Link } from "react-router-dom";
import { all_routes } from "../../Router/all_routes";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import {
    RotateCcw,
} from "feather-icons-react/build/IconComponents";

const Invoices = () => {
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
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body">
                                    <nav className="nav nav-style-1 nav-pills mb-3" role="tablist">
                                        <Link
                                            className="nav-link active"
                                            data-bs-toggle="tab"
                                            role="tab"
                                            aria-current="page"
                                            to="#nav-products"
                                            aria-selected="true"
                                        >
                                            Pendientes
                                            <span className="badge bg-secondary ms-1 rounded-pill">32</span>
                                        </Link>
                                        <Link
                                            className="nav-link"
                                            data-bs-toggle="tab"
                                            role="tab"
                                            to="#nav-cart"
                                            aria-selected="false"
                                        >
                                            Pagas
                                            <span className="badge bg-success ms-1 rounded-pill">32</span>
                                        </Link>
                                        <Link
                                            className="nav-link"
                                            data-bs-toggle="tab"
                                            role="tab"
                                            to="#nav-orders"
                                            aria-selected="false"
                                        >
                                            Canceladas{" "}
                                            <span className="badge bg-danger ms-1 rounded-pill">4</span>
                                        </Link>
                                        <Link
                                            className="nav-link"
                                            data-bs-toggle="tab"
                                            role="tab"
                                            aria-current="page"
                                            to="#nav-unpaid"
                                            aria-selected="false"
                                        >
                                            Sin pagar
                                            <span className="badge bg-secondary ms-1 rounded-pill">3</span>
                                        </Link>
                                    </nav>
                                    <div className="tab-content">
                                        <div
                                            className="tab-pane show active text-muted"
                                            id="nav-products"
                                            role="tabpanel"
                                        >
                                            <div className="default-cover p-4">
                                                <span className="badge bg-secondary d-inline-block mb-4">
                                                    Order ID : #666661
                                                </span>
                                                <div className="row">
                                                    <div className="col-sm-12 col-md-6 record mb-3">
                                                        <table>
                                                            <tbody>
                                                                <tr className="mb-3">
                                                                    <td>Emitida</td>
                                                                    <td className="colon">:</td>
                                                                    <td className="text">test_empleado</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Cliente</td>
                                                                    <td className="colon">:</td>
                                                                    <td className="text">John David</td>
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
                                                                    <td className="text">$2000</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Fecha</td>
                                                                    <td className="colon">:</td>
                                                                    <td className="text">01-09-2023 13:15:00</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <div className="col-sm-12 col-md-6 record mb-3">
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>Vendedor</td>
                                                                    <td className="colon">:</td>
                                                                    <td className="text">No asignado</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>Estado de proceso</td>
                                                                    <td className="colon">:</td>
                                                                    <td className="text">Almacen: producto no asignados</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <div className="btn-row d-flex align-items-center justify-content-between">
                                                    <Link
                                                        to="#"
                                                        className="btn btn-info btn-icon flex-fill"
                                                    >
                                                        Ver detalles
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="btn btn-danger btn-icon flex-fill"
                                                    >
                                                        Cancelar
                                                    </Link>
                                                    <Link
                                                        to="#"
                                                        className="btn btn-success btn-icon flex-fill"
                                                    >
                                                        Imprimir
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="tab-pane text-muted"
                                            id="nav-cart"
                                            role="tabpanel"
                                        >
                                            test 2
                                        </div>
                                        <div
                                            className="tab-pane text-muted"
                                            id="nav-orders"
                                            role="tabpanel"
                                        >
                                            test 3
                                        </div>
                                        <div
                                            className="tab-pane text-muted"
                                            id="nav-unpaid"
                                            role="tabpanel"
                                        >
                                            test 4
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /product list */}
                </div>
            </div>
        </div>
    );
};

export default Invoices;

import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { PlusCircle, RotateCw } from 'feather-icons-react/build/IconComponents';
import { Check } from 'react-feather';
import Select from 'react-select';
import { all_routes } from "../../Router/all_routes";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from "react-redux";
import { deleteProduct } from "../../services/productService";

import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';

const ProductList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  // const token = useSelector((state) => state.token);

  // useEffect(() => {
  //   console.log("Usuario autenticado:", user);
  //   console.log("Token:", token);
  // }, [user, token]);

  const {
    products,
    // recentProduct, 
    // bestSellers, 
    loading: productsLoading,
  } = useProducts();

  const handleEditProduct = (product) => {
    navigate(all_routes.addproduct, { state: { initialProductData: product } });
  };

  const {
    categories,
    loading: categoriesLoading,
  } = useCategories();

  useEffect(() => {
    if (!productsLoading && !categoriesLoading) {
      console.log("Productos:", products);
      // console.log("Producto Reciente:", recentProduct);
      // console.log("Más Vendidos:", bestSellers);
    }
    // }, [productsLoading, categoriesLoading, products, recentProduct, bestSellers, categories]);
  }, [productsLoading, categoriesLoading, products, categories]);

  const route = all_routes;
  const tax = [
    { value: 'exclusive', label: 'Exclusive' },
    { value: 'inclusive', label: 'Inclusive' },
  ];
  const discounttype = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'earlyPaymentDiscounts', label: 'Early payment discounts' },
  ];


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
      Printer
    </Tooltip>
  );

  const settings = {
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    margin: 0,
    speed: 500,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 5,
        },
      },
      {
        breakpoint: 776,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 567,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  const MySwal = withReactContent(Swal);

  // Función para eliminar producto con confirmación
  const handleDeleteProduct = (product) => {
    MySwal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      cancelButtonColor: "#ff0000",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(product.id);
          MySwal.fire({
            title: "Eliminado!",
            text: "El producto ha sido eliminado.",
            icon: "success",
            confirmButtonText: "OK",
          });
          // Recargar la página para actualizar la lista
          window.location.reload();
        } catch (error) {
          MySwal.fire({
            title: "Error!",
            text: "No se pudo eliminar el producto.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      }
    });
  };

  const showConfirmationAlert = () => {
    MySwal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonColor: '#ff0000',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {

        MySwal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          className: "btn btn-success",
          confirmButtonText: 'OK',
          customClass: {
            confirmButton: 'btn btn-success',
          },
        });
      } else {
        MySwal.close();
      }

    });
  };
  return (
    <div>
      <div className="page-wrapper pos-pg-wrapper ms-0">
        <div className="content pos-design p-0">
          <div className="btn-row d-sm-flex align-items-center">
            <Link to="#" className="btn disabled btn-info">
              <span className="me-1 d-flex align-items-center">
                <RotateCw className="feather-16" />
              </span>
              Refrescar
            </Link>
            <Link
              to={route.addproduct}
              className="btn btn-primary"
            >
              <span className="me-1 d-flex align-items-center">
                <PlusCircle className="feather-16" />
              </span>
              Agregar producto
            </Link>
          </div>
          <div className="row align-items-start pos-wrapper">
            <div className="col-md-12 col-lg-12">
              <div className="pos-categories tabs_wrapper">
                <h5>Categoria</h5>
                <p>Seleccione una de las siguientes categorías</p>
                <Slider {...settings} className='tabs owl-carousel pos-category'>
                  {categories.map((cat) => {
                    return (
                      <div key={cat.id} id={cat.id} className='pos-slick-item'>
                        <Link to="#">
                          {/* <ImageWithBasePath height={64} width={64} src={cat.image.url} alt={cat.image.alt} /> */}
                        </Link>
                        <h6>
                          <Link to="#">{cat.name}</Link>
                        </h6>
                        <span>{cat.productCount}</span>
                      </div>
                    );
                  })}

                </Slider>
                {/* Listado de productos */}
                <div className="pos-products">
                  <div className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-3">Productos</h5>
                  </div>
                  <div className="tabs_container">
                    <div className="tab_content active" data-tab="all">
                      <div className="row">
                      {products?.docs?.map((product) => (
                          <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                            <div className="product-info default-cover card">
                              <Link to="#" className="img-bg">
                                {/* Si deseas mostrar la imagen, descomenta lo siguiente:
                                <ImageWithBasePath
                                  src={product?.image?.url}
                                  alt={product?.image?.alt}
                                  height={100}
                                  width={100}
                                /> */}
                                <span>
                                  <Check className="feather-16" />
                                </span>
                              </Link>
                              <h6 className="cat-name">
                                <Link to="#">
                                  {product.categories.map((cat) => (
                                    <span key={cat.id}>{cat.name} </span>
                                  ))}
                                </Link>
                              </h6>
                              <h6 className="product-name">
                                <Link to="#">{product.name}</Link>
                              </h6>
                              <div className="d-flex align-items-center justify-content-between price">
                                <p><strong>Base:</strong> {product.prices.base}</p>
                                <p><strong>Retail:</strong> {product.prices.retail}</p>
                                <p><strong>Mayorista:</strong> {product.prices.wholesale}</p>
                              </div>
                              <div className="stock-info" style={{ marginTop: "5px" }}>
                                <p><strong>Stock:</strong> {product.stock}</p>
                              </div>
                              {/* Mostrar botones Editar y Eliminar solo si el usuario es admin o manager */}
                              {(user.role === "admin" || user.role === "manager") && (
                                <div className="mt-2 d-flex gap-2">
                                  <button
                                    className="btn btn-sm btn-warning"
                                    onClick={() => handleEditProduct(product)}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeleteProduct(product)}
                                  >
                                    Eliminar
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {console.log("productos:", products)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Receipt */}
      <div
        className="modal fade modal-default"
        id="print-receipt"
        aria-labelledby="print-receipt"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="close p-0"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="icon-head text-center">
                <Link to="#">
                  <ImageWithBasePath
                    src="assets/img/logo.png"
                    width={100}
                    height={30}
                    alt="Receipt Logo"
                  />
                </Link>
              </div>
              <div className="text-center info text-center">
                <h6>Dreamguys Technologies Pvt Ltd.,</h6>
                <p className="mb-0">Phone Number: +1 5656665656</p>
                <p className="mb-0">
                  Email: <Link to="mailto:example@gmail.com">example@gmail.com</Link>
                </p>
              </div>
              <div className="tax-invoice">
                <h6 className="text-center">Tax Invoice</h6>
                <div className="row">
                  <div className="col-sm-12 col-md-6">
                    <div className="invoice-user-name">
                      <span>Name: </span>
                      <span>John Doe</span>
                    </div>
                    <div className="invoice-user-name">
                      <span>Invoice No: </span>
                      <span>CS132453</span>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <div className="invoice-user-name">
                      <span>Customer Id: </span>
                      <span>#LL93784</span>
                    </div>
                    <div className="invoice-user-name">
                      <span>Date: </span>
                      <span>01.07.2022</span>
                    </div>
                  </div>
                </div>
              </div>
              <table className="table-borderless w-100 table-fit">
                <thead>
                  <tr>
                    <th># Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1. Red Nike Laser</td>
                    <td>$50</td>
                    <td>3</td>
                    <td className="text-end">$150</td>
                  </tr>
                  <tr>
                    <td>2. Iphone 14</td>
                    <td>$50</td>
                    <td>2</td>
                    <td className="text-end">$100</td>
                  </tr>
                  <tr>
                    <td>3. Apple Series 8</td>
                    <td>$50</td>
                    <td>3</td>
                    <td className="text-end">$150</td>
                  </tr>
                  <tr>
                    <td colSpan={4}>
                      <table className="table-borderless w-100 table-fit">
                        <tbody>
                          <tr>
                            <td>Sub Total :</td>
                            <td className="text-end">$700.00</td>
                          </tr>
                          <tr>
                            <td>Discount :</td>
                            <td className="text-end">-$50.00</td>
                          </tr>
                          <tr>
                            <td>Shipping :</td>
                            <td className="text-end">0.00</td>
                          </tr>
                          <tr>
                            <td>Tax (5%) :</td>
                            <td className="text-end">$5.00</td>
                          </tr>
                          <tr>
                            <td>Total Bill :</td>
                            <td className="text-end">$655.00</td>
                          </tr>
                          <tr>
                            <td>Due :</td>
                            <td className="text-end">$0.00</td>
                          </tr>
                          <tr>
                            <td>Total Payable :</td>
                            <td className="text-end">$655.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="text-center invoice-bar">
                <p>
                  **VAT against this challan is payable through central
                  registration. Thank you for your business!
                </p>
                <Link to="#">
                  <ImageWithBasePath src="assets/img/barcode/barcode-03.jpg" alt="Barcode" />
                </Link>
                <p>Sale 31</p>
                <p>Thank You For Shopping With Us. Please Come Again</p>
                <Link to="#" className="btn btn-primary">
                  Print Receipt
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Print Receipt */}
      {/* Products */}
      <div
        className="modal fade modal-default pos-modal"
        id="products"
        aria-labelledby="products"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <h5 className="me-4">Products</h5>
                <span className="badge bg-info d-inline-block mb-0">
                  Order ID : #666614
                </span>
              </div>
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
              <form>
                <div className="product-wrap">
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-16.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-17.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0235</span>
                          <h6>
                            <Link to="#">Iphone 14</Link>
                          </h6>
                        </div>
                        <p>$3000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-16.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                  <div className="product-list d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-fill">
                      <Link to="#" className="img-bg me-2">
                        <ImageWithBasePath
                          src="assets/img/products/pos-product-17.png"
                          alt="Products"
                        />
                      </Link>
                      <div className="info d-flex align-items-center justify-content-between flex-fill">
                        <div>
                          <span>PT0005</span>
                          <h6>
                            <Link to="#">Red Nike Laser</Link>
                          </h6>
                        </div>
                        <p>$2000</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Products */}
      <div
        className="modal fade"
        id="create"
        tabIndex={-1}
        aria-labelledby="create"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create</h5>
              <button
                type="button"
                className="close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Customer Name</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Email</label>
                      <input type="email" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Phone</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Country</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>City</label>
                      <input type="text" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks">
                      <label>Address</label>
                      <input type="text" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-cancel"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-submit me-2">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Hold */}
      <div
        className="modal fade modal-default pos-modal"
        id="hold-order"
        aria-labelledby="hold-order"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5>Hold order</h5>
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
              <form>
                <h2 className="text-center p-4">4500.00</h2>
                <div className="input-block">
                  <label>Order Reference</label>
                  <input
                    className="form-control"
                    type="text"
                    defaultValue=""
                    placeholder=""
                  />
                </div>
                <p>
                  The current order will be set on hold. You can retreive this order
                  from the pending order button. Providing a reference to it might
                  help you to identify the order more quickly.
                </p>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Confirm
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Hold */}
      {/* Edit Product */}
      <div
        className="modal fade modal-default pos-modal"
        id="edit-product"
        aria-labelledby="edit-product"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5>Red Nike Laser</h5>
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
              <form>
                <div className="row">
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Product Name <span>*</span>
                      </label>
                      <input type="text" placeholder={45} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Tax Type <span>*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        options={tax}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Tax <span>*</span>
                      </label>
                      <input type="text" placeholder="% 15" />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Discount Type <span>*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        options={discounttype}
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Discount <span>*</span>
                      </label>
                      <input type="text" placeholder={15} />
                    </div>
                  </div>
                  <div className="col-lg-6 col-sm-12 col-12">
                    <div className="input-blocks add-product">
                      <label>
                        Sale Unit <span>*</span>
                      </label>
                      <Select
                        classNamePrefix="react-select"
                        placeholder="Select Option"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer d-sm-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <Link to="#" className="btn btn-primary">
                    Submit
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Product */}
      {/* Recent Transactions */}
      <div
        className="modal fade pos-modal"
        id="recents"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-lg modal-dialog-centered"
          role="document"
        >
          <div className="modal-content">
            <div className="modal-header p-4">
              <h5 className="modal-title">Recent Transactions</h5>
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
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active"
                      id="purchase-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#purchase"
                      type="button"
                      aria-controls="purchase"
                      aria-selected="true"
                      role="tab"
                    >
                      Purchase
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="payment-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#payment"
                      type="button"
                      aria-controls="payment"
                      aria-selected="false"
                      role="tab"
                    >
                      Payment
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="return-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#return"
                      type="button"
                      aria-controls="return"
                      aria-selected="false"
                      role="tab"
                    >
                      Return
                    </button>
                  </li>
                </ul>
                <div className="tab-content">
                  <div
                    className="tab-pane fade show active"
                    id="purchase"
                    role="tabpanel"
                    aria-labelledby="purchase-tab"
                  >
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                              <Link>
                                <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                              <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
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
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="payment" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                              <Link>
                                <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                              <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
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
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="return" role="tabpanel">
                    <div className="table-top">
                      <div className="search-set">
                        <div className="search-input">
                          <input
                            type="text"
                            placeholder="Search"
                            className="form-control form-control-sm formsearch"
                          />
                          <Link to className="btn btn-searchset">
                            <i data-feather="search" className="feather-search" />
                          </Link>
                        </div>
                      </div>
                      <div className="wordset">
                        <ul>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderTooltip}>
                              <Link>
                                <ImageWithBasePath src="assets/img/icons/pdf.svg" alt="img" />
                              </Link>
                            </OverlayTrigger>
                          </li>
                          <li>
                            <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                              <Link data-bs-toggle="tooltip" data-bs-placement="top">
                                <ImageWithBasePath src="assets/img/icons/excel.svg" alt="img" />
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
                        </ul>
                      </div>
                    </div>
                    <div className="table-responsive">
                      <table className="table datanew">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Reference</th>
                            <th>Customer</th>
                            <th>Amount </th>
                            <th className="no-sort">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0101</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0102</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0103</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0104</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0105</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0106</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>19 Jan 2023</td>
                            <td>INV/SL0107</td>
                            <td>Walk-in Customer</td>
                            <td>$1500.00</td>
                            <td className="action-table-data">
                              <div className="edit-delete-action">
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="eye" className="feather-eye" />
                                </Link>
                                <Link className="me-2 p-2" to="#">
                                  <i data-feather="edit" className="feather-edit" />
                                </Link>
                                <Link onClick={showConfirmationAlert}
                                  className="p-2 confirm-text"
                                  to="#"
                                >
                                  <i
                                    data-feather="trash-2"
                                    className="feather-trash-2"
                                  />
                                </Link>
                              </div>
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
      {/* /Recent Transactions */}


    </div>
  )
}

export default ProductList;

// ProductList.jsx – carrito (agrega 1-a-1 y botón junto a editar/eliminar)
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ImageWithBasePath from '../../core/img/imagewithbasebath';
import { PlusCircle, RotateCw } from 'feather-icons-react/build/IconComponents';
import { Check } from 'react-feather';
import { all_routes } from '../../Router/all_routes';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useSelector } from 'react-redux';
import { deleteProduct } from '../../services/productService';
import ProductFilters from "../../components/ProductFilters";

import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import { getAppliedPrice } from '../../utils/priceUtils';

const ProductList = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const defaultFilters = {
    categoryId: null,
    colors: [],
    sizes: [],
    shoeSizes: [],
    inStockOnly: false,
  };

  const [filters, setFilters] = useState(defaultFilters);

  const { products } = useProducts(filters);
  const { categories } = useCategories();

  // ---------- carrito ---------- //
  const [invoiceProducts, setInvoiceProducts] = useState([]);
  const [invoicePage, setInvoicePage] = useState(1);
  const PAGE_SIZE = 5;

  const totalInvoicePages = useMemo(
    () => Math.ceil(invoiceProducts.length / PAGE_SIZE) || 1,
    [invoiceProducts.length]
  );

  // ---------- handlers ---------- //
  const addToInvoice = (product) => {
    if (!product.stock) {
      window.alert('Sin stock disponible.');
      return;
    }

    setInvoiceProducts((prev) => {
      const exists = prev.find((i) => i.productId === product.id);
      if (exists) {
        if (exists.quantity + 1 > product.stock) {
          window.alert('La cantidad total supera el stock disponible.');
          return prev;
        }
        return prev.map((i) =>
          i.productId === product.id
            ? {
              ...i,
              quantity: i.quantity + 1,
              appliedPrice: getAppliedPrice(i.prices, i.quantity + 1),
            }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          stock: product.stock,
          image: product.image,
          prices: product.prices,
          appliedPrice: getAppliedPrice(product.prices, 1),
        },
      ];
    });
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setInvoiceProducts((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: newQuantity, appliedPrice: getAppliedPrice(item.prices, newQuantity) }
          : item
      )
    );
  };

  const removeFromInvoice = (productId) => setInvoiceProducts((prev) => prev.filter((i) => i.productId !== productId));

  const handleGenerateInvoice = () => {
    if (!invoiceProducts.length) {
      window.alert('Debe agregar al menos un producto para generar la factura.');
      return;
    }
    navigate(all_routes.invoicecreate, { state: { invoiceItems: invoiceProducts } });
  };

  // ---------- slider ---------- //
  const sliderSettings = {
    dots: false,
    autoplay: false,
    slidesToShow: 5,
    speed: 500,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 5 } },
      { breakpoint: 800, settings: { slidesToShow: 5 } },
      { breakpoint: 776, settings: { slidesToShow: 2 } },
      { breakpoint: 567, settings: { slidesToShow: 1 } },
    ],
  };

  // ---------- delete ---------- //
  const MySwal = withReactContent(Swal);
  const handleDeleteProduct = (product) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00ff00',
      cancelButtonColor: '#ff0000',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProduct(product.id);
          MySwal.fire('Eliminado!', 'El producto ha sido eliminado.', 'success');
        } catch {
          MySwal.fire('Error!', 'No se pudo eliminar el producto.', 'error');
        }
      }
    });
  };

  // ---------- data ---------- //
  const allProducts = products && products.docs ? products.docs : Array.isArray(products) ? products : [];
  const paginatedInvoice = invoiceProducts.slice((invoicePage - 1) * PAGE_SIZE, invoicePage * PAGE_SIZE);

  // ---------- render ---------- //
  return (
    <div>
      <div className="page-wrapper pos-pg-wrapper ms-0">
        <div className="content pos-design p-0">
          {/* botones superiores */}
          <div className="btn-row d-sm-flex align-items-center">
            <Link to="#" className="btn disabled btn-info">
              <RotateCw className="feather-16" /> Refrescar
            </Link>
            <Link to={all_routes.addproduct} className="btn btn-primary">
              <PlusCircle className="feather-16" /> Agregar producto
            </Link>
          </div>

          <ProductFilters filters={filters} onChange={setFilters} />

          {/* categorías y productos */}
          <div className="row align-items-start pos-wrapper">
            <div className="col-12">
              <div className="pos-categories tabs_wrapper">
                <h5>Categoría</h5>
                <p>Seleccione una de las siguientes categorías</p>
                <Slider {...sliderSettings} className="tabs owl-carousel pos-category">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={filters.categoryId === cat.id ? "pos-slick-item active" : "pos-slick-item"}
                      onClick={() => setFilters(f => ({
                        ...f,
                        categoryId: cat.id,
                        // coméntalo si NO quieres resetear color/talla al cambiar cat:
                        colors: [],
                        sizes: [],
                        shoeSizes: []
                      }))}
                    >
                      <h6>{cat.name}</h6>
                      <span>{cat.productCount}</span>
                    </div>
                  ))}
                </Slider>

                <div className="pos-products">
                  <h5 className="mb-3">Productos</h5>
                  <div className="row">
                    {allProducts.map((product) => (
                      <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div className="product-info default-cover card h-100 d-flex flex-column">
                          <Link to="#" className="img-bg">
                            <ImageWithBasePath src={product.image?.url} alt={product.image?.alt} height={100} width={100} />
                            <span><Check className="feather-16" /></span>
                          </Link>
                          <h6 className="cat-name mt-2">{product.categories.map((c) => (<span key={c.id}>{c.name} </span>))}</h6>
                          <h6 className="product-name">{product.name}</h6>
                          <div className="price mb-2">
                            <p><strong>Caja:</strong> {product.prices.base}</p>
                            <p><strong>Detalle:</strong> {product.prices.retail}</p>
                            <p><strong>Por mayor:</strong> {product.prices.wholesale}</p>
                          </div>
                          <p><strong>Stock:</strong> {product.stock}</p>

                          {/* botones */}
                          <div className="d-flex gap-2 mt-auto mb-2">
                            {(user.role === 'admin' || user.role === 'manager') && (
                              <>
                                <button className="btn btn-sm btn-warning" onClick={() => navigate(all_routes.addproduct, { state: { initialProductData: product } })}>Editar</button>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteProduct(product)}>Eliminar</button>
                              </>
                            )}
                            <button className="btn btn-sm btn-primary" onClick={() => addToInvoice(product)}>Agregar</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* carrito */}
      {!!invoiceProducts.length && (
        <div className="container mt-4">
          <div className="row">
            {paginatedInvoice.map((item) => (
              <div key={item.productId} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
                <div className="card h-100">
                  {item.image && <ImageWithBasePath src={item.image.url} alt={item.image.alt} height={100} width={100} />}
                  <div className="card-body">
                    <h6>{item.productName}</h6>
                    <div className="d-flex align-items-center">
                      <input
                        type="number"
                        value={item.quantity}
                        min={1}
                        max={item.stock}
                        onChange={(e) => handleQuantityChange(item.productId, Number(e.target.value))}
                        className="form-control form-control-sm"
                        style={{ width: 70 }}
                      />
                      <span className="ms-2">{item.appliedPrice}</span>
                    </div>
                    <button className="btn btn-danger btn-sm mt-2" onClick={() => removeFromInvoice(item.productId)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalInvoicePages > 1 && (
            <div className="d-flex justify-content-center">
              <button className="btn btn-secondary btn-sm me-2" disabled={invoicePage === 1} onClick={() => setInvoicePage((p) => p - 1)}>
                Anterior
              </button>
              <span className="align-self-center">Página {invoicePage} de {totalInvoicePages}</span>
              <button className="btn btn-secondary btn-sm ms-2" disabled={invoicePage === totalInvoicePages} onClick={() => setInvoicePage((p) => p + 1)}>
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}

      {/* botón factura */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, background: '#fff', padding: 10, border: '1px solid #ccc', borderRadius: 4 }}>
        <span style={{ fontWeight: 'bold' }}>{invoiceProducts.length} producto(s) seleccionado(s)</span>
        <button className="btn btn-success btn-sm d-block mt-2" onClick={handleGenerateInvoice}>Generar Factura</button>
      </div>
    </div>
  );
};

export default ProductList;
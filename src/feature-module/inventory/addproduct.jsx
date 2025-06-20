import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import AddCategory from "../../core/modals/inventory/addcategory";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";
import useCategories from "../../hooks/useCategories";
import FilterChips from "../../components/FilterChips"; 
import { createProduct, updateProduct } from "../../services/productService";
import "./product-form.css";

/* chips */
const COLOR_OPTIONS = ["red", "blue", "black", "white"];
const SIZE_OPTIONS  = ["xs", "s", "m", "l", "xl", "xxl"];
const SHOE_OPTIONS  = ["34","35","36","37","38","39","40","41","42","43","44","45"];   // ✔️ nuevas

const ProductForm = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  /* ----------- edición o creación ----------- */
  const initialProductData = location.state?.initialProductData || null;
  const isEditing = initialProductData !== null;

  /* ----------- estados principales ----------- */
  const [name, setName]               = useState(isEditing ? initialProductData.name        : "");
  const [description] = useState(isEditing ? initialProductData.description : "");
  const [stock, setStock]             = useState(isEditing ? initialProductData.stock       : "");
  const [isFeatured, setIsFeatured]   = useState(isEditing ? initialProductData.isFeatured  : false);
  const [basePrice, setBasePrice]     = useState(isEditing ? initialProductData.prices.base : "");
  const [retailPrice, setRetailPrice] = useState(isEditing ? initialProductData.prices.retail : "");
  const [wholesalePrice, setWholesalePrice] = useState(isEditing ? initialProductData.prices.wholesale : "");
  // const [image, setImage]             = useState(null);

  /* ----------- tipo de producto (NUEVO) ------ */
  const [productType, setProductType] = useState(
    isEditing ? initialProductData.productType || "general" : "general"
  );

  /* ----------- categorías ----------- */
  const { categories, loading: catLoading } = useCategories();
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(
    isEditing && initialProductData.categories
      ? initialProductData.categories.map(cat => ({ value:cat.id||cat._id, label:cat.name }))
      : []
  );
  useEffect(() => {
    if (!catLoading) setCategoryOptions(
      categories.map(cat => ({ value:cat.id||cat._id, label:cat.name }))
    );
  }, [catLoading, categories]);

  /* ----------- colores y tallas ----------- */
  const [selectedColors, setSelectedColors]       = useState(isEditing ? initialProductData.colors    || [] : []);
  const [selectedSizes, setSelectedSizes]         = useState(isEditing ? initialProductData.sizes     || [] : []);
  const [selectedShoeSizes, setSelectedShoeSizes] = useState(isEditing ? initialProductData.shoeSizes || [] : []);

  /* ----------- helpers ----------- */
  // const handleFileChange = (e)=>{ if(e.target.files?.[0]) setImage(e.target.files[0]); };

  /* ----------- submit ----------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const needCloth = productType==="apparel"  && !selectedSizes.length;
    const needShoe  = productType==="footwear" && !selectedShoeSizes.length;

    if (
      !name || !stock || !basePrice || !retailPrice || !wholesalePrice ||
      !selectedCategories.length || !selectedColors.length || needCloth || needShoe
    ){
      return alert("Complete todos los campos obligatorios.");
    }

    const productData = {
      name,
      description,
      productType,                         // ✔️ se envía al backend
      categories: selectedCategories.map(o=>o.value),
      colors: selectedColors,
      sizes:     productType==="apparel"  ? selectedSizes     : [],
      shoeSizes: productType==="footwear" ? selectedShoeSizes : [],
      prices:{ base:Number(basePrice), wholesale:Number(wholesalePrice), retail:Number(retailPrice) },
      stock:Number(stock),
      isFeatured,
    };

    try {
      if (isEditing) await updateProduct(initialProductData.id, productData);
      else           await createProduct(productData);
      navigate(all_routes.productlist);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el producto");
    }
  };

  /* ----------- render ----------- */
  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Encabezado abreviado */}
        <div className="page-header">
          <div className="page-title">
            <h4>{isEditing ? "Editar Producto" : "Nuevo Producto"}</h4>
            <h6>{isEditing ? "Modificar datos" : "Crear producto"}</h6>
          </div>
          <Link to={all_routes.productlist} className="btn btn-secondary">
            <ArrowLeft className="me-2"/> Volver
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card">
            <div className="card-body pb-0">

              {/* tipo de producto */}
              <div className="row mb-3">
                <div className="col-lg-4 col-sm-6">
                  <label className="form-label">Tipo de producto</label>
                  <select
                    className="form-select"
                    value={productType}
                    onChange={e=>{
                      setProductType(e.target.value);
                      setSelectedSizes([]); setSelectedShoeSizes([]);
                    }}
                  >
                    <option value="general">General</option>
                    <option value="apparel">Ropa</option>
                    <option value="footwear">Calzado</option>
                  </select>
                </div>
              </div>

              {/* fila nombre/stock/destacado */}
              <div className="row">
                <div className="col-lg-4 col-sm-6 mb-3">
                  <label className="form-label">Nombre</label>
                  <input className="form-control" value={name} onChange={e=>setName(e.target.value)} required/>
                </div>
                <div className="col-lg-4 col-sm-6 mb-3">
                  <label className="form-label">Stock</label>
                  <input type="number" className="form-control" value={stock} onChange={e=>setStock(e.target.value)} required/>
                </div>
                <div className="col-lg-4 col-sm-6 mb-3 d-flex align-items-end">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="featured" checked={isFeatured} onChange={()=>setIsFeatured(!isFeatured)}/>
                    <label className="form-check-label" htmlFor="featured">Destacado</label>
                  </div>
                </div>
              </div>

              {/* categorías */}
              <div className="row mb-3">
                <div className="col-lg-4 col-sm-6">
                  <label className="form-label">Categorías</label>
                  <Select
                    isMulti placeholder="Elegir"
                    classNamePrefix="react-select"
                    options={categoryOptions}
                    value={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                </div>
              </div>

              {/* ───── Colores ───── */}
<div className="col-lg-4 col-sm-6 mb-3">
  <label className="form-label d-block">Colores</label>

  <FilterChips
    options={COLOR_OPTIONS}
    value={selectedColors}
    onToggle={(val) =>
      setSelectedColors((prev) =>
        prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
      )
    }
    colorMode   // le dice al componente que pinte chips circulares de color
  />
</div>

{/* ───── Tallas ropa (solo si es apparel) ───── */}
{productType === "apparel" && (
  <div className="col-lg-4 col-sm-6 mb-3">
    <label className="form-label d-block">Tallas ropa</label>

    <FilterChips
      options={SIZE_OPTIONS}
      value={selectedSizes}
      onToggle={(val) =>
        setSelectedSizes((prev) =>
          prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
        )
      }
    />
  </div>
)}

{/* ───── Tallas calzado (solo si es footwear) ───── */}
{productType === "footwear" && (
  <div className="col-lg-4 col-sm-6 mb-3">
    <label className="form-label d-block">Tallas calzado</label>

    <FilterChips
      options={SHOE_OPTIONS}
      value={selectedShoeSizes}
      onToggle={(val) =>
        setSelectedShoeSizes((prev) =>
          prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]
        )
      }
    />
  </div>
)}


              {/* precios */}
              <div className="row">
                <div className="col-lg-4 col-sm-6 mb-3">
                  <label className="form-label">Precio Caja</label>
                  <input type="number" className="form-control" value={basePrice} onChange={e=>setBasePrice(e.target.value)} required/>
                </div>
                <div className="col-lg-4 col-sm-6 mb-3">
                  <label className="form-label">Precio Detalle</label>
                  <input type="number" className="form-control" value={retailPrice} onChange={e=>setRetailPrice(e.target.value)} required/>
                </div>
                <div className="col-lg-4 col-sm-6 mb-3">
                  <label className="form-label">Precio Mayor</label>
                  <input type="number" className="form-control" value={wholesalePrice} onChange={e=>setWholesalePrice(e.target.value)} required/>
                </div>
              </div>
            </div>
          </div>

          {/* botones */}
          <div className="text-end mt-4">
            <button type="button" className="btn btn-secondary me-2" onClick={()=>navigate(all_routes.productlist)}>Cancelar</button>
            <button type="submit" className="btn btn-primary">{isEditing ? "Actualizar Producto" : "Guardar Producto"}</button>
          </div>
        </form>
      </div>
      <AddCategory />
    </div>
  );
};

ProductForm.propTypes = { initialProductData: PropTypes.object };

export default ProductForm;

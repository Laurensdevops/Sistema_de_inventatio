import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { all_routes } from "../../Router/all_routes";
import AddCategory from "../../core/modals/inventory/addcategory";
import {
  ArrowLeft,
  ChevronDown,
  Info,
  PlusCircle,
} from "feather-icons-react/build/IconComponents";
import useCategories from "../../hooks/useCategories";
import { createProduct } from "../../services/productService";

const AddProduct = () => {
  const navigate = useNavigate();
  const route = all_routes;

  const { categories, loading: categoriesLoading } = useCategories();

  // Opciones para el select de categorías
  const [categoryOptions, setCategoryOptions] = useState([]);
  // Estado para almacenar las categorías seleccionadas (recuerda que es hasMany)
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [basePrice, setBasePrice] = useState("");
  const [retailPrice, setRetailPrice] = useState("");
  const [wholesalePrice, setWholesalePrice] = useState("");
  const [image, setImage] = useState(null); 

  // Cuando ya se tengan las categorías, se construyen las opciones para el select
  useEffect(() => {
    if (!categoriesLoading && categories.length > 0) {
      const options = categories.map((cat) => ({
        value: cat.id || cat._id, // Asegúrate de que la categoría tenga id o _id
        label: cat.name,
      }));
      setCategoryOptions(options);
    }
  }, [categoriesLoading, categories]);

  // Función para manejar el cambio del file (imagen)
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !stock ||
      !basePrice ||
      !retailPrice ||
      !wholesalePrice ||
      selectedCategories.length === 0
    ) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const productData = {
      name,
      description,
      categories: selectedCategories.map((option) => option.value),
      prices: {
        base: Number(basePrice),
        wholesale: Number(wholesalePrice),
        retail: Number(retailPrice),
      },
      stock: Number(stock),
      isFeatured,
    };

    console.log("productData=>", productData, image)

    try {
      await createProduct(productData);
      alert("Producto creado exitosamente");
      navigate(route.productlist);
    } catch (error) {
      alert("Error al crear el producto");
      console.error("Error:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Nuevo producto</h4>
              <h6>Crear un nuevo producto</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <div className="page-btn">
                <Link to={route.productlist} className="btn btn-secondary">
                  <ArrowLeft className="me-2" />
                  Volver a Producto
                </Link>
              </div>
            </li>
          </ul>
        </div>
        {/* Formulario para agregar producto */}
        <form onSubmit={handleSubmit}>
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
                          <span>Información del producto</span>
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
                      <div className="row">
                        {/* Nombre del producto */}
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Nombre producto</label>
                            <input
                              type="text"
                              className="form-control"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        {/* Stock */}
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="mb-3 add-product">
                            <label className="form-label">Stock</label>
                            <input
                              type="number"
                              className="form-control"
                              value={stock}
                              onChange={(e) => setStock(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        {/* Destacado */}
                        <div className="col-lg-4 col-sm-6 col-12">
                          <div className="status-toggle modal-status d-flex justify-content-between align-items-center ms-2">
                            <div className="security-type">
                              <div className="security-title">
                                <h5>Destacado?</h5>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              id="featured"
                              className="check"
                              checked={isFeatured}
                              onChange={(e) => setIsFeatured(e.target.checked)}
                            />
                            <label htmlFor="featured" className="checktoggle"></label>
                          </div>
                        </div>
                      </div>
                      <div className="addservice-info">
                        <div className="row">
                          {/* Selección de categoría */}
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <div className="add-newplus">
                                <label className="form-label">Categoría</label>
                                <Link
                                  to="#"
                                  data-bs-toggle="modal"
                                  data-bs-target="#add-units-category"
                                >
                                  <PlusCircle className="plus-down-add" />
                                  <span>Agregar</span>
                                </Link>
                              </div>
                              <Select
                                classNamePrefix="react-select"
                                options={categoryOptions}
                                placeholder="Elegir"
                                isMulti
                                value={selectedCategories}
                                onChange={setSelectedCategories}
                              />
                            </div>
                          </div>
                          {/* Upload de imagen (opcional) */}
                          <div className="input-blocks col-lg-4 col-sm-6 col-12">
                            <div className="image-upload">
                              <input type="file" onChange={handleFileChange} />
                              <div className="image-uploads">
                                <PlusCircle className="plus-down-add me-0" />
                                <h4>Add Images</h4>
                              </div>
                            </div>
                          </div>
                          {/* Descripción */}
                          <div className="col-lg-12">
                            <div className="input-blocks summer-description-box transfer mb-3">
                              <label>Descripción</label>
                              <textarea
                                className="form-control h-100"
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                              <p className="mt-1">Máximo 60 caracteres</p>
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          {/* Precio base */}
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">Precio base</label>
                              <input
                                type="number"
                                className="form-control"
                                value={basePrice}
                                onChange={(e) => setBasePrice(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          {/* Precio por detalle */}
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">
                                Precio por detalle
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={retailPrice}
                                onChange={(e) => setRetailPrice(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          {/* Precio por mayor */}
                          <div className="col-lg-4 col-sm-6 col-12">
                            <div className="mb-3 add-product">
                              <label className="form-label">
                                Precio por mayor
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                value={wholesalePrice}
                                onChange={(e) => setWholesalePrice(e.target.value)}
                                required
                              />
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
          {/* Botones de acción */}
          <div className="col-lg-12">
            <div className="btn-addproduct mb-4">
              <button
                type="button"
                className="btn btn-cancel me-2"
                onClick={() => navigate(route.productlist)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-submit">
                Guardar Producto
              </button>
            </div>
          </div>
        </form>
        {/* /formulario */}
      </div>
      <AddCategory />
    </div>
  );
};

export default AddProduct;

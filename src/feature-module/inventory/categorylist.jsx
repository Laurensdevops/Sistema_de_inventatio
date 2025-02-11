import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Link } from "react-router-dom";
import {
  Calendar,
  Filter,
  PlusCircle,
  RotateCcw,
  Sliders,
  Zap,
} from "feather-icons-react/build/IconComponents";
import Select from "react-select";
import { DatePicker } from "antd";
import AddCategoryList from "../../core/modals/inventory/addcategorylist";
import EditCategoryList from "../../core/modals/inventory/editcategorylist";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import Table from "../../core/pagination/datatable";
import useCategories from "../../hooks/useCategories";
import { deleteCategory } from "../../services/categoryService";

const CategoryList = () => {
  // Obtenemos las categorías y la función para refrescarlas
  const { categories, loading, error, refreshCategories } = useCategories();

  // Para la edición, almacenamos la categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Transformamos la data para la tabla
  const dataSource = categories.map((cat) => ({
    key: cat.id || cat._id,
    category: cat.name,
    categoryslug: cat.slug || "N/A",
    createdon: cat.createdAt
      ? new Date(cat.createdAt).toLocaleDateString()
      : "N/A",
    status: cat.status || "Active",
    _id: cat.id || cat._id, // Incluimos el id para las acciones
  }));

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const toggleFilterVisibility = () => setIsFilterVisible((prev) => !prev);

  // Opciones para ordenar y filtrar
  const sortOptions = [
    { value: "date", label: "Sort by Date" },
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
  ];
  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Funciones para renderizar tooltips
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
  const renderRefreshTooltip = (props) => (
    <Tooltip id="refresh-tooltip" {...props}>
      Refresh
    </Tooltip>
  );

  // SweetAlert2 para confirmar eliminación
  const MySwal = withReactContent(Swal);

  const handleDelete = (record) => {
    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonColor: "#00ff00",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#ff0000",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(record._id);
          MySwal.fire({
            title: "Deleted!",
            text: "Your category has been deleted.",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-success",
            },
          });
          refreshCategories();
        } catch (error) {
          MySwal.fire({
            title: "Error!",
            text: "Failed to delete category.",
            confirmButtonText: "OK",
            customClass: {
              confirmButton: "btn btn-danger",
            },
          });
        }
      }
    });
  };

  const handleEdit = (record) => {
    // Guarda la categoría seleccionada para editar
    setSelectedCategory(record);
    // El modal de edición se abrirá (por ejemplo, mediante Bootstrap, con id="edit-category")
  };

  // Definición de columnas para la tabla
  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Category Slug",
      dataIndex: "categoryslug",
      sorter: (a, b) => a.categoryslug.localeCompare(b.categoryslug),
    },
    {
      title: "Created On",
      dataIndex: "createdon",
      sorter: (a, b) => new Date(a.createdon) - new Date(b.createdon),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`badge ${
            text === "Active" ? "badge-success" : "badge-secondary"
          }`}
        >
          <Link to="#">{text}</Link>
        </span>
      ),
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => (
        <div className="action-table-data">
          <div className="edit-delete-action">
            <Link
              className="me-2 p-2"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#edit-category"
              onClick={() => handleEdit(record)}
            >
              <i data-feather="edit" className="feather-edit"></i>
            </Link>
            <Link className="confirm-text p-2" to="#">
              <i
                data-feather="trash-2"
                className="feather-trash-2"
                onClick={() => handleDelete(record)}
              ></i>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="page-wrapper">
      <div className="content">
        {/* Encabezado */}
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4>Category</h4>
              <h6>Manage your categories</h6>
            </div>
          </div>
          <ul className="table-top-head">
            <li>
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <Link>
                  <ImageWithBasePath
                    src="assets/img/icons/pdf.svg"
                    alt="pdf icon"
                  />
                </Link>
              </OverlayTrigger>
            </li>
            <li>
              <OverlayTrigger placement="top" overlay={renderExcelTooltip}>
                <Link>
                  <ImageWithBasePath
                    src="assets/img/icons/excel.svg"
                    alt="excel icon"
                  />
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
                <Link onClick={refreshCategories}>
                  <RotateCcw />
                </Link>
              </OverlayTrigger>
            </li>
          </ul>
          <div className="page-btn">
            <Link
              to="#"
              className="btn btn-added"
              data-bs-toggle="modal"
              data-bs-target="#add-category"
            >
              <PlusCircle className="me-2" />
              Add New Category
            </Link>
          </div>
        </div>

        {/* Sección de búsqueda, filtrado y ordenamiento */}
        <div className="card table-list-card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set">
                <div className="search-input">
                  <input
                    type="text"
                    placeholder="Search"
                    className="form-control form-control-sm formsearch"
                  />
                  <Link to="#" className="btn btn-searchset">
                    <i data-feather="search" className="feather-search" />
                  </Link>
                </div>
              </div>
              <div className="search-path">
                <Link
                  className={`btn btn-filter ${
                    isFilterVisible ? "setclose" : ""
                  }`}
                  id="filter_search"
                  onClick={toggleFilterVisibility}
                >
                  <Filter className="filter-icon" />
                  <span>
                    <ImageWithBasePath
                      src="assets/img/icons/closes.svg"
                      alt="close filter"
                    />
                  </span>
                </Link>
              </div>
              <div className="form-sort">
                <Sliders className="info-img" />
                <Select
                  className="img-select"
                  classNamePrefix="react-select"
                  options={sortOptions}
                  placeholder="Newest"
                />
              </div>
            </div>

            {/* Filtros */}
            {isFilterVisible && (
              <div className="card visible" id="filter_inputs">
                <div className="card-body pb-0">
                  <div className="row">
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Zap className="info-img" />
                        <Select
                          className="img-select"
                          options={statusOptions}
                          classNamePrefix="react-select"
                          placeholder="Choose Status"
                        />
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12">
                      <div className="input-blocks">
                        <Calendar className="info-img" />
                        <div className="input-groupicon">
                          <DatePicker
                            className="filterdatepicker"
                            placeholder="Choose Date"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-sm-6 col-12 ms-auto">
                      <div className="input-blocks">
                        <Link className="btn btn-filters ms-auto">
                          <i
                            data-feather="search"
                            className="feather-search"
                          />{" "}
                          Search
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabla de categorías */}
            <div className="table-responsive">
              {loading ? (
                <p>Loading categories...</p>
              ) : error ? (
                <p>Error loading categories.</p>
              ) : (
                <Table columns={columns} dataSource={dataSource} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modales para crear y editar */}
      <AddCategoryList refreshCategories={refreshCategories} />
      <EditCategoryList
        selectedCategory={selectedCategory}
        refreshCategories={refreshCategories}
      />
    </div>
  );
};

export default CategoryList;

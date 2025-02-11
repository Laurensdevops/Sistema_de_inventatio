import React, { useState, useEffect } from "react";
import { updateCategory } from "../../../services/categoryService"; // Asegúrate de que la ruta sea la correcta
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PropTypes from "prop-types";

const EditCategoryList = ({ selectedCategory, refreshCategories }) => {
  const MySwal = withReactContent(Swal);

  // Estado local para el nombre de la categoría
  const [categoryName, setCategoryName] = useState("");

  // Cuando selectedCategory cambie, actualizamos el estado local
  useEffect(() => {
    if (selectedCategory) {
      setCategoryName(selectedCategory.category || "");
    }
  }, [selectedCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Construimos el objeto con el único campo a actualizar: name
    const categoryData = {
      name: categoryName,
    };

    try {
      await updateCategory(selectedCategory.key || selectedCategory._id, categoryData);
      MySwal.fire({
        icon: "success",
        title: "Updated!",
        text: "Category updated successfully!",
      });
      // Refrescamos la lista de categorías
      refreshCategories();
      // Cerrar el modal (se utiliza la API de Bootstrap 5)
      const modalElement = document.getElementById("edit-category");
      if (modalElement) {
        const modal = window.bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
      }
    } catch (err) {
      console.error("Error updating category:", err);
      MySwal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update category.",
      });
    }
  };

  return (
    <div>
      {/* Edit Category Modal */}
      <div className="modal fade" id="edit-category" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Edit Category</h4>
                  </div>
                  <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        className="form-control"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Edit Category Modal */}
    </div>
  );
};

EditCategoryList.propTypes = {
  selectedCategory: PropTypes.object,
  refreshCategories: PropTypes.func.isRequired,
};

export default EditCategoryList;

import React, { useState } from "react";
import { createCategory } from "../../../services/categoryService"; // Asegúrate de que la ruta sea la correcta

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Función que se encarga de enviar el formulario y crear la categoría
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que se haya ingresado un nombre
    if (!categoryName.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Llamar al servicio pasando el objeto { name: categoryName }
      await createCategory({ name: categoryName });
      
      // Opcional: aquí podrías actualizar la lista de categorías o notificar al usuario
      setCategoryName(""); // Limpiar el input
      
      // Opcional: cerrar el modal programáticamente si lo deseas.  
      // Si usas Bootstrap, puedes hacerlo utilizando su API (por ejemplo, mediante jQuery o refs)
      
    } catch (err) {
      console.error("Error al crear categoría:", err);
      setError("Ocurrió un error al crear la categoría.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Modal para agregar categoría */}
      <div className="modal fade" id="add-units-category" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered custom-modal-two">
          <div className="modal-content">
            <div className="page-wrapper-new p-0">
              <div className="content">
                <div className="modal-header border-0 custom-modal-header">
                  <div className="page-title">
                    <h4>Add New Category</h4>
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
                <div className="modal-body custom-modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        disabled={loading}
                      />
                      {error && <div className="text-danger mt-1">{error}</div>}
                    </div>
                    <div className="modal-footer-btn">
                      <button
                        type="button"
                        className="btn btn-cancel me-2"
                        data-bs-dismiss="modal"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-submit" disabled={loading}>
                        {loading ? "Enviando..." : "Submit"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategory;

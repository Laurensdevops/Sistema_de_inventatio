import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const HorizontalSidebar = () => {
  // Obtener el usuario actual (suponiendo que se almacena en localStorage)
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive5, setIsActive5] = useState(false);

  const [subActive1, setsubActive1] = useState(false);
  const [subActive4, setsubActive4] = useState(false);
  const [subActive5, setsubActive5] = useState(false);

  const sidebarRef = useRef(null);

  // Función para cerrar todos los menús
  const closeAllMenus = () => {
    setIsActive1(false);
    setIsActive2(false);
    setIsActive3(false);
    setIsActive5(false);
    setsubActive1(false);
    setsubActive4(false);
    setsubActive5(false);
  };

  // Listener para detectar click fuera del sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubClick1 = () => {
    setsubActive1(!subActive1);
  };
  const handleSubClick4 = () => {
    setsubActive4(!subActive4);
  };
  const handleSubClick5 = () => {
    setsubActive5(!subActive5);
  };

  const handleSelectClick1 = () => {
    setIsActive1(!isActive1);
    setIsActive2(false);
    setIsActive3(false);
    setIsActive5(false);
  };
  const handleSelectClick2 = () => {
    setIsActive1(false);
    setIsActive2(!isActive2);
    setIsActive3(false);
    setIsActive5(false);
  };
  const handleSelectClick3 = () => {
    setIsActive1(false);
    setIsActive2(false);
    setIsActive3(!isActive3);
    setIsActive5(false);
  };
  const handleSelectClick5 = () => {
    setIsActive1(false);
    setIsActive2(false);
    setIsActive3(false);
    setIsActive5(!isActive5);
  };

  return (
    <div ref={sidebarRef} className="sidebar horizontal-sidebar">
      <div id="sidebar-menu-3" className="sidebar-menu">
        <ul className="nav">
          {/* Sección Inventario: solo visible para roles que NO sean "courier" ni "seller" */}
          {!(currentUser.role === "courier" || currentUser.role === "seller") && (
            <li className="submenu">
              <Link
                to="#"
                onClick={handleSelectClick1}
                className={isActive1 ? "subdrop" : ""}
              >
                <img src="assets/img/icons/product.svg" alt="img" />
                <span> Inventario </span> <span className="menu-arrow" />
              </Link>
              <ul style={{ display: isActive1 ? "block" : "none" }}>
                <li>
                  <Link to="product-list">
                    <span>Productos</span>
                  </Link>
                </li>
                <li>
                  <Link to="add-product">
                    <span>Crear producto</span>
                  </Link>
                </li>
                <li>
                  <Link to="category-list">
                    <span>Categorías</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}

          {/* Sección Ventas: visible para todos */}
          <li className="submenu">
            <Link
              to="#"
              onClick={handleSelectClick2}
              className={isActive2 ? "subdrop" : ""}
            >
              <img src="assets/img/icons/purchase1.svg" alt="img" />
              <span>Ventas</span> <span className="menu-arrow" />
            </Link>
            <ul style={{ display: isActive2 ? "block" : "none" }}>
              <li className="submenu">
                <Link
                  to="#"
                  onClick={handleSubClick1}
                  className={subActive1 ? "subdrop" : ""}
                >
                  <span>Facturas</span>
                  <span className="menu-arrow" />
                </Link>
                <ul style={{ display: subActive1 ? "block" : "none" }}>
                  <li>
                    <Link to="invoices">
                      <span>Facturas</span>
                    </Link>
                  </li>
                  {/* La opción de "Crear factura" se mostrará solo si el usuario NO es mensajero */}
                  {currentUser.role !== "courier" && (
                    <li>
                      <Link to="invoice-create">
                        <span>Crear factura</span>
                      </Link>
                    </li>
                  )}
                </ul>
              </li>
            </ul>
          </li>

          {/* Sección Gestión de usuarios: solo visible para roles que NO sean "courier" ni "seller" */}
          {!(currentUser.role === "courier" || currentUser.role === "seller") && (
            <li className="submenu">
              <Link
                to="#"
                onClick={handleSelectClick3}
                className={isActive3 ? "subdrop" : ""}
              >
                <img src="assets/img/icons/users1.svg" alt="img" />
                <span>Gestión usuarios</span> <span className="menu-arrow" />
              </Link>
              <ul style={{ display: isActive3 ? "block" : "none" }}>
                <li className="submenu">
                  <Link
                    to="#"
                    onClick={handleSubClick4}
                    className={subActive4 ? "subdrop" : ""}
                  >
                    <span>Personal</span>
                    <span className="menu-arrow" />
                  </Link>
                  <ul style={{ display: subActive4 ? "block" : "none" }}>
                    <li>
                      <Link to="customers">
                        <span>Empleados</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="#">
                        <span>Contactos</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu">
                  <Link
                    to="roles-permissions"
                    onClick={handleSubClick5}
                    className={subActive5 ? "subdrop" : ""}
                  >
                    <span>Roles &amp; Permisos</span>
                  </Link>
                  <ul style={{ display: subActive5 ? "block" : "none" }}>
                    {/* Opciones adicionales */}
                  </ul>
                </li>
              </ul>
            </li>
          )}

          {/* Sección Reportes: Visible para todos o condicionalmente según tus necesidades */}
          <li className="submenu">
            <Link
              to="#"
              onClick={handleSelectClick5}
              className={isActive5 ? "subdrop" : ""}
            >
              <img src="assets/img/icons/printer.svg" alt="img" />
              <span>Reportes</span> <span className="menu-arrow" />
            </Link>
            <ul style={{ display: isActive5 ? "block" : "none" }}>
              <li>
                <Link to="/users-report">
                  <span>Reporte de ventas</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default HorizontalSidebar;

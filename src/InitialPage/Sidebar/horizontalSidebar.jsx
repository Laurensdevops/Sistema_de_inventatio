import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const HorizontalSidebar = () => {
  const [isActive1, setIsActive1] = useState(false);
  const [isActive2, setIsActive2] = useState(false);
  const [isActive3, setIsActive3] = useState(false);
  const [isActive5, setIsActive5] = useState(false);

  const [subActive1, setsubActive1] = useState(false);
  const [subActive2, setsubActive2] = useState(false);
  const [subActive3, setsubActive3] = useState(false);
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
    setsubActive2(false);
    setsubActive3(false);
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
  const handleSubClick2 = () => {
    setsubActive2(!subActive2);
  };
  const handleSubClick3 = () => {
    setsubActive3(!subActive3);
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
                <Link to="#">
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
                  <span>Categorias</span>
                </Link>
              </li>
              <li>
                <Link to="sub-categories">
                  <span>Sub categorias</span>
                </Link>
              </li>
            </ul>
          </li>
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
                  <li>
                    <Link to="invoice-create">
                      <span>Crear factura</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="coupons">
                      <span>Cupones</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="submenu">
                <Link
                  to="#"
                  onClick={handleSubClick2}
                  className={subActive2 ? "subdrop" : ""}
                >
                  <span>Proximamente</span>
                  <span className="menu-arrow" />
                </Link>
              </li>
              <li className="submenu">
                <Link
                  to="#"
                  onClick={handleSubClick3}
                  className={subActive3 ? "subdrop" : ""}
                >
                  <span>Proximamente</span>
                  <span className="menu-arrow" />
                </Link>
              </li>
            </ul>
          </li>
          <li className="submenu">
            <Link
              to="#"
              onClick={handleSelectClick3}
              className={isActive3 ? "subdrop" : ""}
            >
              <img src="assets/img/icons/users1.svg" alt="img" />
              <span>Gention usuarios</span> <span className="menu-arrow" />
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
                <ul style={{ display: subActive4 ? "block" : "none" }}>
                  {/* Puedes incluir más opciones aquí */}
                </ul>
              </li>
            </ul>
          </li>
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

import React, { useState, useEffect } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "../../core/json/siderbar_data";
import HorizontalSidebar from "./horizontalSidebar";
import CollapsedSidebar from "./collapsedSidebar";

const Sidebar = () => {
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [layoutView] = useState("horizontal");
  useEffect(() => {
    document.documentElement.setAttribute("data-layout-style", layoutView);
  }, [layoutView]);

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");

  const toggleSidebar = (title) => {
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem) => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  // Filtrar las secciones según el rol del usuario.
  // Ocultamos "Inventario", "Gestión de usuarios" y "Personal" para "courier" y "seller".
  const filteredSidebarData = SidebarData.filter((mainItem) => {
    if (
      (mainItem.label === "Inventario" ||
        mainItem.label === "Gestion de usuarios" ||
        mainItem.label === "Personal") &&
      (currentUser.role === "courier" || currentUser.role === "seller")
    ) {
      return false;
    }
    return true;
  }).map((mainItem) => {
    // En la sección de Ventas, si el usuario es "courier" se oculta la opción "Crear factura"
    if (mainItem.label === "Ventas" && currentUser.role === "courier") {
      const newSubItems = mainItem.submenuItems.filter(
        (item) => item.label !== "Crear factura"
      );
      return { ...mainItem, submenuItems: newSubItems };
    }
    return mainItem;
  });

  return (
    <div>
      <div className="sidebar" id="sidebar">
        <Scrollbars>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {filteredSidebarData?.map((mainLabel, index) => (
                  <li className="submenu-open" key={index}>
                    <h6 className="submenu-hdr">{mainLabel.label}</h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title, i) => (
                        <React.Fragment key={i}>
                          <li
                            className={`submenu ${
                              !title.submenu && title.link === location.pathname
                                ? "custom-active-hassubroute-false"
                                : ""
                            }`}
                          >
                            <Link
                              to={title.link}
                              onClick={() => toggleSidebar(title.label)}
                              className={`${
                                subOpen === title.label ? "subdrop" : ""
                              } ${
                                title.link === location.pathname ? "active" : ""
                              }`}
                            >
                              {title.icon}
                              <span className="custom-active-span">
                                {title.label}
                              </span>
                              {title.submenu && <span className="menu-arrow" />}
                            </Link>
                            {title.submenu && (
                              <ul
                                style={{
                                  display:
                                    subOpen === title.label ? "block" : "none",
                                }}
                              >
                                {title.submenuItems?.map((item, titleIndex) => (
                                  <li className="submenu submenu-two" key={titleIndex}>
                                    <Link
                                      to={item.link}
                                      className={`${
                                        item.link === location.pathname
                                          ? "active"
                                          : ""
                                      } ${
                                        subsidebar === item.label ? "subdrop" : ""
                                      }`}
                                      onClick={() => toggleSubsidebar(item.label)}
                                    >
                                      {item.label}
                                      {item.submenu && (
                                        <span className="menu-arrow inside-submenu" />
                                      )}
                                    </Link>
                                    {item.submenu && (
                                      <ul
                                        style={{
                                          display:
                                            subsidebar === item.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item.submenuItems?.map(
                                          (subItem, subIndex) => (
                                            <li key={subIndex}>
                                              <Link
                                                to={subItem.link}
                                                className={`${
                                                  subItem.link === location.pathname
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {subItem.label}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </li>
                        </React.Fragment>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Scrollbars>
      </div>
      <HorizontalSidebar />
      <CollapsedSidebar />
    </div>
  );
};

export default Sidebar;

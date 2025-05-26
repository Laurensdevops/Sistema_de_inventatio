import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import ImageWithBasePath from "../../core/img/imagewithbasebath";
import { Search, Settings, User, XCircle } from "react-feather";
import { all_routes } from "../../Router/all_routes";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../core/redux/action";

const Header = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const roleText = {
    admin: "Administrador",
    courier: "Mensajero",
    seller: "Vendedor",
    warehouse: "Almacén",
    manager: "Gerente",
  };
/* eslint-disable react/prop-types */


  const route = all_routes;
  const [toggle] = useState(false);

  const dispatch = useDispatch();

  // Obtener usuario desde Redux
  // const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    // Eliminar datos del localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Despachar acción de logout en Redux
    navigate("/signin");

    dispatch(logoutUser());

    // Redirigir al login

  };

  const isElementVisible = (element) => {
    return element.offsetWidth > 0 || element.offsetHeight > 0;
  };

  useEffect(() => {
    const handleMouseover = (e) => {
      e.stopPropagation();

      const body = document.body;
      const toggleBtn = document.getElementById("toggle_btn");

      if (
        body.classList.contains("mini-sidebar") &&
        isElementVisible(toggleBtn)
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("mouseover", handleMouseover);

    return () => {
      document.removeEventListener("mouseover", handleMouseover);
    };
  }, []);
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const sidebarOverlay = () => {
    document?.querySelector(".main-wrapper")?.classList?.toggle("slide-nav");
    document?.querySelector(".sidebar-overlay")?.classList?.toggle("opened");
    document?.querySelector("html")?.classList?.toggle("menu-opened");
  };

  return (
    <>
      <div className="header">
        {/* Logo */}
        <div
          className={`header-left ${toggle ? "" : "active"}`}
          onMouseLeave={expandMenu}
          onMouseOver={expandMenuOpen}
        >
          <Link style={{height: "100px"}} to="/product-list" className="logo logo-normal">
            <ImageWithBasePath src="assets/img/logo.png" alt="img" />
          </Link>
        </div>
        {/* /Logo */}
        <Link
          id="mobile_btn"
          className="mobile_btn"
          to="#"
          onClick={sidebarOverlay}
        >
          <span className="bar-icon">
            <span />
            <span />
            <span />
          </span>
        </Link>
        {/* Header Menu */}
        <ul className="nav user-menu">
          {/* Search */}
          <li className="nav-item nav-searchinputs">
            <div className="top-nav-search">
              <Link to="#" className="responsive-search">
                <Search />
              </Link>
              <form action="#" className="dropdown">
                <div
                  className="searchinputs dropdown-toggle"
                  id="dropdownMenuClickable"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="false"
                >
                  <input type="text" placeholder="Search" />
                  <div className="search-addon">
                    <span>
                      <XCircle className="feather-14" />
                    </span>
                  </div>
                </div>
                <div
                  className="dropdown-menu search-dropdown"
                  aria-labelledby="dropdownMenuClickable"
                >
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="search" className="feather-16" />
                      </span>
                      Recent Searches
                    </h6>
                    <ul className="search-tags">
                      <li>
                        <Link to="#">Products</Link>
                      </li>
                      <li>
                        <Link to="#">Sales</Link>
                      </li>
                      <li>
                        <Link to="#">Applications</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="help-circle" className="feather-16" />
                      </span>
                      Help
                    </h6>
                    <p>
                      How to Change Product Volume from 0 to 200 on Inventory
                      management
                    </p>
                    <p>Change Product Name</p>
                  </div>
                  <div className="search-info">
                    <h6>
                      <span>
                        <i data-feather="user" className="feather-16" />
                      </span>
                      Customers
                    </h6>
                    <ul className="customers">
                      <li>
                        <Link to="#">
                          Aron Varu
                          <ImageWithBasePath
                            src="assets/img/profiles/avator1.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Jonita
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-01.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                      <li>
                        <Link to="#">
                          Aaron
                          <ImageWithBasePath
                            src="assets/img/profiles/avatar-10.jpg"
                            alt
                            className="img-fluid"
                          />
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </form>
            </div>
          </li>
          {/* /Notifications */}
          <li className="nav-item nav-item-box">
            <Link to="/general-settings">
              {/* <i data-feather="settings" /> */}
              <FeatherIcon icon="settings" />
            </Link>
          </li>
          <li className="nav-item dropdown has-arrow main-drop">
            <Link
              to="#"
              className="dropdown-toggle nav-link userset"
              data-bs-toggle="dropdown"
            >
              <span className="user-info">
                <span className="user-letter">
                  <ImageWithBasePath
                    src="assets/img/profiles/avator1.jpg"
                    alt="img"
                    className="img-fluid"
                  />
                </span>
                <span className="user-detail">
                  <span className="user-name">{currentUser?.email}</span>
                  <span className="user-role">
                    {roleText[currentUser?.role] || currentUser?.role}
                  </span>
                </span>
              </span>
            </Link>
            <div className="dropdown-menu menu-drop-user">
              <div className="profilename">
                <div className="profileset">
                  <span className="user-img">
                    <ImageWithBasePath
                      src="assets/img/profiles/avator1.jpg"
                      alt="img"
                    />
                    <span className="status online" />
                  </span>
                  <div className="profilesets">
                    <h6>{currentUser?.email}</h6>
                    <h5>{roleText[currentUser?.role] || currentUser?.role}</h5>
                  </div>
                </div>
                <hr className="m-0" />
                <Link className="dropdown-item" to={route.profile}>
                  <User className="me-2" /> My Profile
                </Link>
                <Link className="dropdown-item" to={route.generalsettings}>
                  <Settings className="me-2" />
                  Settings
                </Link>
                <hr className="m-0" />
                <Link className="dropdown-item logout pb-0" onClick={handleLogout}>
                  <ImageWithBasePath
                    src="assets/img/icons/log-out.svg"
                    alt="img"
                    className="me-2"
                  />
                  Logout
                </Link>
              </div>
            </div>
          </li>
        </ul>
        {/* /Header Menu */}
        {/* Mobile Menu */}
        <div className="dropdown mobile-user-menu">
          <Link
            to="#"
            className="nav-link dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-ellipsis-v" />
          </Link>
          <div className="dropdown-menu dropdown-menu-right">
            <Link className="dropdown-item" to="profile">
              My Profile
            </Link>
            <Link className="dropdown-item" to="generalsettings">
              Settings
            </Link>
            <Link className="dropdown-item" to="signin">
              Logout
            </Link>
          </div>
        </div>
        {/* /Mobile Menu */}
      </div>
    </>
  );
};

export default Header;

import React from "react";
import { useNavigate } from "react-router-dom";
import ImageWithBasePath from "../../../core/img/imagewithbasebath";
import { all_routes } from "../../../Router/all_routes";

const Error404 = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const routerRedirect = {
    admin: "/product-list",
    courier: "/invoices",
    seller: "/invoices",
    warehouse: "/invoices",
    manager: "/product-list",
  };

  const redirect = () => {
    if (currentUser && currentUser.role) {
      navigate(routerRedirect[currentUser.role] || "/app");
    } else {
      navigate(all_routes.home || "/app");
    }
  };

  return (
    <div className="main-wrapper">
      <div className="error-box">
        <div className="error-img">
          <ImageWithBasePath
            src="assets/img/authentication/error-404.png"
            className="img-fluid"
            alt="Error 404"
          />
        </div>
        <h3 className="h2 mb-3">Oops, algo salió mal</h3>
        <p>Error 404</p>
        <button onClick={redirect} className="btn btn-primary">
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default Error404;

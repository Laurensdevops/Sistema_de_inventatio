// PrivateRoute.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state.user);

  // Si no hay usuario logueado, redirige al login.
  if (!user) {
    return <Navigate to="/signin" />;
  }

  // Si el rol del usuario no está permitido para esta ruta, redirige a error.
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/error-404" />;
  }

  // Si pasa la validación, se muestra el contenido.
  return children;
};

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!user && !storedUser) {
    return <Navigate to="/signin" replace />;
  }

  const role = user?.role || storedUser?.role;
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

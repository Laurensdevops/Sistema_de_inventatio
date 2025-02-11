// router.jsx
import React from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../InitialPage/Sidebar/Header";
import Sidebar from "../InitialPage/Sidebar/Sidebar";
import { pagesRoute, publicRoutes } from "./router.link";
import PrivateRoute from "./PrivateRoute"; // Importa el componente modificado

const AllRoutes = () => {
  const headerCollapsed = useSelector((state) => state.toggle_header);

  // Layout para rutas protegidas (por ejemplo, dashboard, inventario, etc.)
  const HeaderLayout = () => (
    <div className={`main-wrapper ${headerCollapsed ? "header-collapse" : ""}`}>
      <Header />
      <Sidebar />
      <Outlet />
    </div>
  );

  // Layout para páginas públicas (como el login)
  const AuthPagesLayout = () => (
    <div className={headerCollapsed ? "header-collapse" : ""}>
      <Outlet />
    </div>
  );

  return (
    <Routes>
      {/* Rutas protegidas dentro del layout principal */}
      <Route path="/" element={<HeaderLayout />}>
        {publicRoutes.map((route, id) => (
          <Route
            key={id}
            path={route.path}
            element={
              <PrivateRoute allowedRoles={route.allowedRoles}>
                {route.element}
              </PrivateRoute>
            }
          />
        ))}
      </Route>

      {/* Rutas públicas (como signin) */}
      <Route path="/" element={<AuthPagesLayout />}>
        {pagesRoute.map((route, id) => (
          <Route key={id} path={route.path} element={route.element} />
        ))}
      </Route>

      {/* Ruta de error 404 */}
      <Route path="*" element={<Navigate to="/error-404" />} />
    </Routes>
  );
};

export default AllRoutes;

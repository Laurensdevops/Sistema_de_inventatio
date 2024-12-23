import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../InitialPage/Sidebar/Header";
import Sidebar from "../InitialPage/Sidebar/Sidebar";
import { pagesRoute, publicRoutes } from "./router.link";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const AllRoutes = () => {
  const data = useSelector((state) => state.toggle_header);
  const HeaderLayout = () => ( 
    <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
    {/* <Loader /> */}
    <Header />
    <Sidebar />
    <Outlet />
  </div>
  );

  const Authpages = () => (
    <div className={data ? "header-collapse" : ""}>
      <Outlet />
      {/* <Loader /> */}
      {/* <ThemeSettings /> */}
    </div>
  );

  return (
    <div>
      <Routes>
        <Route path={"/"} element={<HeaderLayout />}>
          {publicRoutes.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>

        <Route path={"/"} element={<Authpages />}>
          {pagesRoute.map((route, id) => (
            <Route path={route.path} element={route.element} key={id} />
          ))}
        </Route>
      </Routes>
    </div>
  );
};
export default AllRoutes;

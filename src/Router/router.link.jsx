import React from "react";
import { Route, Navigate } from "react-router-dom";
import ProductDetail from "../feature-module/inventory/productdetail";
import ProductList from "../feature-module/inventory/productlist";
import AddProduct from "../feature-module/inventory/addproduct";
import CategoryList from "../feature-module/inventory/categorylist";
import SubCategories from "../feature-module/inventory/subcategories";
import EditProduct from "../feature-module/inventory/editproduct";
import Customers from "../feature-module/people/customers";
import StockAdjustment from "../feature-module/stock/stockAdjustment";
import Invoices from "../feature-module/sales/invoices";
import InvoiceCreate from "../feature-module/sales/invoicescreate";
import Managestock from "../feature-module/stock/managestock";
import CustomerReport from "../feature-module/Reports/customerreport";
import Invoicereport from "../feature-module/Reports/invoicereport";
import InventoryReport from "../feature-module/Reports/inventoryreport";
import GeneralSettings from "../feature-module/settings/generalsettings/generalsettings";
import Preference from "../feature-module/settings/systemsettings/preference";
import Users from "../feature-module/usermanagement/users";
import RolesPermissions from "../feature-module/usermanagement/rolespermissions";
import Permissions from "../feature-module/usermanagement/permissions";
import DeleteAccount from "../feature-module/usermanagement/deleteaccount";

import InvoiceReport from "../feature-module/sales/invoicereport";

import Signin from "../feature-module/pages/login/signin";

// import EmailVerification from "../feature-module/pages/emailverification/emailverification";
// import Forgotpassword from "../feature-module/pages/forgotpassword/forgotpassword";
// import Twostepverification from "../feature-module/pages/twostepverification/twostepverification";
// import Lockscreen from "../feature-module/pages/lockscreen";
// import Error404 from "../feature-module/pages/errorpages/error404";
// import Error500 from "../feature-module/pages/errorpages/error500";
// import Blankpage from "../feature-module/pages/blankpage";
// import Comingsoon from "../feature-module/pages/comingsoon";
// import Undermaintainence from "../feature-module/pages/undermaintainence";

// import EditEmployee from "../feature-module/hrm/editemployee";
// import AddEmployee from "../feature-module/hrm/addemployee";




const routes = all_routes;

import Coupons from "../feature-module/coupons/coupons";
import { all_routes } from "./all_routes";
export const publicRoutes = [
  {
    id: 1,
    path: routes.productlist,
    name: "products",
    element: <ProductList />,
    route: Route,
  },
  {
    id: 2,
    path: routes.addproduct,
    name: "products",
    element: <AddProduct />,
    route: Route,
  },
  {
    id: 3,
    path: routes.categorylist,
    name: "categorylist",
    element: <CategoryList />,
    route: Route,
  },
  {
    id: 64,
    path: routes.subcategories,
    name: "subcategories",
    element: <SubCategories />,
    route: Route,
  },
  {
    id: 65,
    path: routes.editproduct,
    name: "editproduct",
    element: <EditProduct />,
    route: Route,
  },
  // {
  //   id: 67,
  //   path: routes.qrcode,
  //   name: "qrcode",
  //   element: <QRcode />,
  //   route: Route,
  // },
  {
    id: 84,
    path: routes.customers,
    name: "customers",
    element: <Customers />,
    route: Route,
  },
  // {
  //   id: 85,
  //   path: routes.suppliers,
  //   name: "suppliers",
  //   element: <Suppliers />,
  //   route: Route,
  // },
  // {
  //   id: 86,
  //   path: routes.storelist,
  //   name: "storelist",
  //   element: <StoreList />,
  //   route: Route,
  // },
  {
    id: 87,
    path: routes.managestock,
    name: "managestock",
    element: <Managestock />,
    route: Route,
  },
  {
    id: 88,
    path: routes.stockadjustment,
    name: "stockadjustment",
    element: <StockAdjustment />,
    route: Route,
  },
  {
    id: 92,
    path: routes.inventoryreport,
    name: "inventoryreport",
    element: <InventoryReport />,
    route: Route,
  },
  {
    id: 5,
    path: routes.invoicecreate,
    name: "invoicecreate",
    element: <InvoiceCreate />,
    route: Route,
  },
  {
    id: 10001,
    path: routes.invoices,
    name: "invoices",
    element: <Invoices />,
    route: Route,
  },
  {
    id: 93,
    path: routes.invoicereport,
    name: "invoicereport",
    element: <Invoicereport />,
    route: Route,
  },
  {
    id: 95,
    path: routes.customerreport,
    name: "customerreport",
    element: <CustomerReport />,
    route: Route,
  },
  {
    id: 89,
    path: routes.generalsettings,
    name: "generalsettings",
    element: <GeneralSettings />,
    route: Route,
  },
  {
    id: 99,
    path: routes.preference,
    name: "preference",
    element: <Preference />,
    route: Route,
  },
  {
    id: 102,
    path: routes.invoicereport,
    name: "invoicereport",
    element: <InvoiceReport />,
    route: Route,
  },
  // {
  //   id: 20,
  //   path: routes.blankpage,
  //   name: "blankpage",
  //   element: <Blankpage />,
  //   route: Route,
  // },
  {
    id: 104,
    path: routes.users,
    name: "users",
    element: <Users />,
    route: Route,
  },
  {
    id: 105,
    path: routes.rolespermission,
    name: "rolespermission",
    element: <RolesPermissions />,
    route: Route,
  },
  {
    id: 106,
    path: routes.permissions,
    name: "permissions",
    element: <Permissions />,
    route: Route,
  },
  {
    id: 107,
    path: routes.deleteaccount,
    name: "deleteaccount",
    element: <DeleteAccount />,
    route: Route,
  },
  {
    id: 113,
    path: routes.productdetails,
    name: "productdetails",
    element: <ProductDetail />,
    route: Route,
  },
  // {
  //   id: 114,
  //   path: routes.warehouses,
  //   name: "warehouses",
  //   element: <WareHouses />,
  //   route: Route,
  // },
  {
    id: 115,
    path: routes.coupons,
    name: "coupons",
    element: <Coupons />,
    route: Route,
  },
  {
    id: 116,
    path: "*",
    name: "NotFound",
    element: <Navigate to="/" />,
    route: Route,
  },
  {
    id: 117,
    path: '/',
    name: 'Root',
    element: <Navigate to="/signin" />,
    route: Route,
  },
];

export const pagesRoute = [
  {
    id: 1,
    path: routes.signin,
    name: "signin",
    element: <Signin />,
    route: Route,
  },
  // {
  //   id: 7,
  //   path: routes.forgotPassword,
  //   name: "forgotPassword",
  //   element: <Forgotpassword />,
  //   route: Route,
  // },
  // {
  //   id: 12,
  //   path: routes.emailverification,
  //   name: "emailverification",
  //   element: <EmailVerification />,
  //   route: Route,
  // },
  // {
  //   id: 14,
  //   path: routes.twostepverification,
  //   name: "twostepverification",
  //   element: <Twostepverification />,
  //   route: Route,
  // },
  // {
  //   id: 17,
  //   path: routes.lockscreen,
  //   name: "lockscreen",
  //   element: <Lockscreen />,
  //   route: Route,
  // },
  // {
  //   id: 18,
  //   path: routes.error404,
  //   name: "error404",
  //   element: <Error404 />,
  //   route: Route,
  // },
  // {
  //   id: 19,
  //   path: routes.error500,
  //   name: "error500",
  //   element: <Error500 />,
  //   route: Route,
  // },
  // {
  //   id: 20,
  //   path: routes.comingsoon,
  //   name: "comingsoon",
  //   element: <Comingsoon />,
  //   route: Route,
  // },
  // {
  //   id: 21,
  //   path: routes.undermaintenance,
  //   name: "undermaintenance",
  //   element: <Undermaintainence />,
  //   route: Route,
  // },
];

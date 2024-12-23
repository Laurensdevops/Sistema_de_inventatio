import initialState from "./initial.value";

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case "Product_list":
      return { ...state, product_list: action.payload };
    case "toggle_header":
      return { ...state, toggle_header: action.payload };
    case "Invoicereport_Data":
      return { ...state, invoicereport_data: action.payload };
    case "customer_data":
      return { ...state, customerdata: action.payload };
    case "Userlist_data":
      return { ...state, userlist_data: action.payload };
    case "Rolesandpermission_data":
      return { ...state, rolesandpermission_data: action.payload };
    case "Deleteaccount_data":
      return { ...state, deleteaccount_data: action.payload };
    case "Lowstock_data":
      return { ...state, lowstock_data: action.payload };
    case "Categotylist_data":
      return { ...state, categotylist_data: action.payload };
    case "Layoutstyle_data":
      return { ...state, layoutstyledata: action.payload };
    default:
      return state;
  }
};

export default rootReducer;

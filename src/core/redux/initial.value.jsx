const initialState = {
  layoutstyledata: localStorage.getItem("layoutStyling"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
};

export default initialState;

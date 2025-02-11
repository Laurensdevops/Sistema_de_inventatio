export const setLayoutChange = (payload) => ({
  type: "Layoutstyle_data",
  payload,
});

export const loginUser = (user, token) => ({
  type: "LOGIN_USER",
  payload: { user, token },
});

export const logoutUser = () => ({
  type: "LOGOUT_USER",
});

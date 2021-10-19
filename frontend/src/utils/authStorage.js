const AUTH_TOKEN_KEY = "opmart_token";

export const getToken = () => {
  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setToken = (token) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearToken = () => {
  window.localStorage.removeItem(AUTH_TOKEN_KEY);
};

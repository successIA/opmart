import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "../../api";
import { clearToken, getToken, setToken } from "../../utils/authStorage";

const fetchUser = async () => {
  const token = getToken();
  if (token) {
    const response = await api.get("/accounts/user/");
    return response.data;
  }
  return null;
};

export const useUserQuery = () =>
  useQuery(["user"], fetchUser, {
    staleTime: Infinity,
    cacheTime: Infinity,
    retry: 2,
  });

const register = async (data) => {
  const response = await api.post("/accounts/signup/", data);
  setToken(response.data.token);
  return response.data.user;
};

export const useRegisterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(register, {
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
};

const login = async (data) => {
  const response = await api.post("/accounts/login/", data);
  setToken(response.data.token);
  return response.data.user;
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(login, {
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data);
    },
  });
};

const logout = async (data) => {
  await api.post("/accounts/logout/", data);
  clearToken();
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(logout, {
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
    },
  });
};

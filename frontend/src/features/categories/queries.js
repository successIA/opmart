import { useQuery } from "react-query";
import api from "../../api";

const fetchCategories = async () => {
  const response = await api.get("/categories/");
  return response.data;
};

export const useCategoriesQuery = () =>
  useQuery(["categories"], () => fetchCategories(), {
    cacheTime: Infinity,
    staleTime: Infinity,
  });

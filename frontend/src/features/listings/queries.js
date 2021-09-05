import { useQuery } from "react-query";
import api from "../../api";

const fetchListings = async () => {
  const response = await api.get("/listings/");
  return response.data;
};

export const useListingsQuery = () =>
  useQuery(["listings"], () => fetchListings());

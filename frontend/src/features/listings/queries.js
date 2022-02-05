import { useQuery, useMutation } from "react-query";
import api from "../../api";

const fetchListings = async () => {
  const response = await api.get("/listings/");
  return response.data;
};

export const useListingsQuery = () =>
  useQuery(["listings"], () => fetchListings());

const fetchListing = async (listingId) => {
  const response = await api.get(`/listings/${listingId}/`);
  return response.data;
};

export const useListingQuery = (listingId) =>
  useQuery({
    queryKey: ["listings", listingId],
    queryFn: () => fetchListing(listingId),
  });

const createListing = async (data) => {
  const response = await api.post("/listings/", data);
  return response.data;
};

export const useListingCreateMutation = (data) => useMutation(createListing);

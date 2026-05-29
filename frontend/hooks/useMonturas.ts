import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { monturasApi, MonturaFilters } from "../lib/api/monturas";
import { Montura } from "../lib/types";

export const useMonturas = () => {
  const queryClient = useQueryClient();

  const useGetMonturas = (filters: MonturaFilters = {}) =>
    useQuery({
      queryKey: ["monturas", filters],
      queryFn: () => monturasApi.getAll(filters),
    });

  const useGetMontura = (id: number) =>
    useQuery({
      queryKey: ["montura", id],
      queryFn: () => monturasApi.getById(id),
      enabled: !!id,
    });

  const adjustStockMutation = useMutation({
    mutationFn: ({ id, stock }: { id: number; stock: number }) =>
      monturasApi.adjustStock(id, stock),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["monturas"] });
      queryClient.invalidateQueries({ queryKey: ["montura", data.idMontura] });
    },
  });

  return {
    useGetMonturas,
    useGetMontura,
    adjustStockMutation,
  };
};

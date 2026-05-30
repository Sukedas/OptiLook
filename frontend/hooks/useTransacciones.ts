import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { transaccionesApi, TransaccionFilters } from "../lib/api/transacciones";
import { CreateTransaccion } from "../lib/types";

export const useTransacciones = () => {
  const queryClient = useQueryClient();

  const useGetTransacciones = (filters: TransaccionFilters = {}) =>
    useQuery({
      queryKey: ["transacciones", filters],
      queryFn: () => transaccionesApi.getAll(filters),
    });

  const useGetTransaccion = (id: number) =>
    useQuery({
      queryKey: ["transaccion", id],
      queryFn: () => transaccionesApi.getById(id),
      enabled: !!id,
    });

  const createTransaccionMutation = useMutation({
    mutationFn: (dto: CreateTransaccion) => transaccionesApi.create(dto),
    onSuccess: () => {
      // Invalidate queries to refresh caches
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["monturas"] });
    },
  });

  const transitionEstadoMutation = useMutation({
    mutationFn: ({ id, estado }: { id: number; estado: string }) =>
      transaccionesApi.transitionEstado(id, estado),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["transacciones"] });
      queryClient.invalidateQueries({ queryKey: ["transaccion", data.idTransaccion] });
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["monturas"] });
    },
  });

  return {
    useGetTransacciones,
    useGetTransaccion,
    createTransaccionMutation,
    transitionEstadoMutation,
  };
};

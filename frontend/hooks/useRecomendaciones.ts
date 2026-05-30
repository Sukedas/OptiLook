import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recomendacionesApi, GenerarRecomendacionPayload } from "../lib/api/recomendaciones";

export const useRecomendaciones = () => {
  const queryClient = useQueryClient();

  const useGetClienteRecomendaciones = (clienteId: number) =>
    useQuery({
      queryKey: ["clienteRecomendaciones", clienteId],
      queryFn: () => recomendacionesApi.getHistory(clienteId),
      enabled: !!clienteId,
    });

  const generarRecomendacionesMutation = useMutation({
    mutationFn: (payload: GenerarRecomendacionPayload) =>
      recomendacionesApi.generar(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clienteRecomendaciones", variables.idUsuario] });
      queryClient.invalidateQueries({ queryKey: ["cliente", variables.idUsuario] });
    },
  });

  return {
    useGetClienteRecomendaciones,
    generarRecomendacionesMutation,
  };
};

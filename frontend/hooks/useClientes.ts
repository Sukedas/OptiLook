import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clientesApi } from "../lib/api/clientes";
import { CreateCliente, UpdateCliente } from "../lib/types";

export const useClientes = () => {
  const queryClient = useQueryClient();

  const useGetClientes = (skip = 0, limit = 50) =>
    useQuery({
      queryKey: ["clientes", skip, limit],
      queryFn: () => clientesApi.getAll(skip, limit),
    });

  const useGetCliente = (id: number) =>
    useQuery({
      queryKey: ["cliente", id],
      queryFn: () => clientesApi.getById(id),
      enabled: !!id,
    });

  const useGetClienteTransacciones = (id: number) =>
    useQuery({
      queryKey: ["clienteTransacciones", id],
      queryFn: () => clientesApi.getTransacciones(id),
      enabled: !!id,
    });

  const createClienteMutation = useMutation({
    mutationFn: (dto: CreateCliente) => clientesApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });

  const updateClienteMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCliente }) =>
      clientesApi.update(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
      queryClient.invalidateQueries({ queryKey: ["cliente", data.idUsuario] });
    },
  });

  const deleteClienteMutation = useMutation({
    mutationFn: (id: number) => clientesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientes"] });
    },
  });

  const useGetClienteFormulas = (id: number) =>
    useQuery({
      queryKey: ["clienteFormulas", id],
      queryFn: () => clientesApi.getFormulas(id),
      enabled: !!id,
    });

  const createFormulaMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: { idFormula: number; idUsuario: number; vigencia: boolean; formulaPDF: string; observacion: string } }) =>
      clientesApi.createFormula(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cliente", data.idUsuario] });
      queryClient.invalidateQueries({ queryKey: ["clienteFormulas", data.idUsuario] });
    },
  });

  const updateFormulaMutation = useMutation({
    mutationFn: ({ id, formulaId, dto }: { id: number; formulaId: number; dto: { vigencia: boolean; formulaPDF: string; observacion: string } }) =>
      clientesApi.updateFormula(id, formulaId, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cliente", data.idUsuario] });
      queryClient.invalidateQueries({ queryKey: ["clienteFormulas", data.idUsuario] });
    },
  });

  const activarFormulaMutation = useMutation({
    mutationFn: ({ id, formulaId }: { id: number; formulaId: number }) =>
      clientesApi.activarFormula(id, formulaId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cliente", data.idUsuario] });
      queryClient.invalidateQueries({ queryKey: ["clienteFormulas", data.idUsuario] });
    },
  });

  return {
    useGetClientes,
    useGetCliente,
    useGetClienteTransacciones,
    useGetClienteFormulas,
    createClienteMutation,
    updateClienteMutation,
    deleteClienteMutation,
    createFormulaMutation,
    updateFormulaMutation,
    activarFormulaMutation,
  };
};

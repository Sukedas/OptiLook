"use client";

import { useState } from "react";
import { useClientes } from "../../../hooks/useClientes";
import ClienteTable from "../../../components/clientes/ClienteTable";
import ClienteForm from "../../../components/clientes/ClienteForm";
import { CreateCliente } from "../../../lib/types";
import { Users, Loader2, RefreshCw } from "lucide-react";

export default function ClientesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const { 
    useGetClientes, 
    createClienteMutation, 
    deleteClienteMutation 
  } = useClientes();

  const { data: clientes = [], isLoading, isError, refetch, isRefetching } = useGetClientes();

  const handleRegisterSubmit = async (data: CreateCliente) => {
    try {
      setErrorToast(null);
      await createClienteMutation.mutateAsync(data);
      setIsFormOpen(false);
    } catch (err) {
      setErrorToast(err instanceof Error ? err.message : "Error al registrar cliente");
    }
  };

  const handleDeleteClient = async (id: number) => {
    if (confirm("¿Estás seguro de que deseas eliminar este cliente? Se realizará una baja lógica en el sistema.")) {
      try {
        await deleteClienteMutation.mutateAsync(id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error al eliminar cliente");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and overview cards */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-400" />
            Panel de Clientes
          </h1>
          <p className="text-xs text-slate-400 mt-1">Registra y administra perfiles de clientes, historiales de compra y diagnósticos ópticos.</p>
        </div>
        
        {/* Refresh Button */}
        <button 
          onClick={() => refetch()}
          disabled={isLoading || isRefetching}
          className="flex items-center gap-1.5 bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 text-slate-300 px-3.5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          Refrescar
        </button>
      </div>

      {/* Error Notifications */}
      {errorToast && (
        <div className="bg-rose-500/10 border border-rose-500/25 p-4 rounded-xl flex items-center justify-between text-xs text-rose-400">
          <span>{errorToast}</span>
          <button onClick={() => setErrorToast(null)} className="font-bold underline text-[10px]">Cerrar</button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
          <p className="text-xs">Cargando base de datos de clientes...</p>
        </div>
      ) : isError ? (
        <div className="glass-panel rounded-2xl border border-rose-500/25 p-8 text-center text-rose-400">
          <p className="text-xs">Ocurrió un error al intentar cargar los clientes. Por favor comprueba que el backend esté disponible.</p>
        </div>
      ) : (
        /* Customers table */
        <ClienteTable 
          clientes={clientes} 
          onDelete={handleDeleteClient}
          onOpenForm={() => setIsFormOpen(true)}
        />
      )}

      {/* Register Customer Modal */}
      {isFormOpen && (
        <ClienteForm 
          onClose={() => {
            setIsFormOpen(false);
            setErrorToast(null);
          }}
          onSubmit={handleRegisterSubmit}
          isLoading={createClienteMutation.isPending}
        />
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useTransacciones } from "../../../hooks/useTransacciones";
import TransaccionTable from "../../../components/transacciones/TransaccionTable";
import { Receipt, SlidersHorizontal, Loader2 } from "lucide-react";

export default function TransaccionesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");

  const { useGetTransacciones, transitionEstadoMutation } = useTransacciones();

  const filters = {
    ...(statusFilter && { status: statusFilter }),
  };

  const { data: transacciones = [], isLoading, isError, refetch } = useGetTransacciones(filters);

  const handleTransitionState = async (id: number, estado: string) => {
    try {
      await transitionEstadoMutation.mutateAsync({ id, estado });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al cambiar el estado");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Receipt className="w-7 h-7 text-indigo-400" />
            Panel de Transacciones
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Administra facturas de venta, cotizaciones pendientes y devoluciones, controlando transiciones de estado de forma segura.
          </p>
        </div>
      </div>

      {/* Modern state filter panel */}
      <div className="glass-panel rounded-2xl border border-slate-800/60 p-5 bg-slate-900/30 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          Filtros
        </div>

        {/* State Filter */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Filtrar por Estado</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Confirmada">Confirmada</option>
            <option value="Procesando">Procesando</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
          <p className="text-xs">Cargando facturación...</p>
        </div>
      ) : isError ? (
        <div className="glass-panel rounded-2xl border border-rose-500/25 p-8 text-center text-rose-400">
          <p className="text-xs">Ocurrió un error al intentar cargar las transacciones. Por favor comprueba tu conexión.</p>
        </div>
      ) : (
        <TransaccionTable 
          transacciones={transacciones} 
          onTransitionState={handleTransitionState}
          isTransitioning={transitionEstadoMutation.isPending}
        />
      )}
    </div>
  );
}

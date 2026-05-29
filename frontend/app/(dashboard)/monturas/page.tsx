"use client";

import { useState } from "react";
import { useMonturas } from "../../../hooks/useMonturas";
import MonturaGrid from "../../../components/monturas/MonturaGrid";
import { Glasses, SlidersHorizontal, Loader2 } from "lucide-react";

export default function MonturasPage() {
  const [genderFilter, setGenderFilter] = useState<string>("");
  const [colorFilter, setColorFilter] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<boolean | undefined>(undefined);

  const { useGetMonturas, adjustStockMutation } = useMonturas();

  const filters = {
    ...(genderFilter && { gender: genderFilter }),
    ...(colorFilter && { color: colorFilter }),
    ...(stockFilter !== undefined && { has_stock: stockFilter }),
  };

  const { data: monturas = [], isLoading, isError, refetch } = useGetMonturas(filters);

  const handleAdjustStock = async (id: number, stock: number) => {
    try {
      await adjustStockMutation.mutateAsync({ id, stock });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al ajustar stock");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and subtitle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Glasses className="w-7 h-7 text-indigo-400" />
            Catálogo de Monturas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Explora monturas por material, color y género, y gestiona niveles de inventario físico.
          </p>
        </div>
      </div>

      {/* Modern custom filter panel */}
      <div className="glass-panel rounded-2xl border border-slate-800/60 p-5 bg-slate-900/30 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          Filtros
        </div>

        {/* Gender Filter */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Género</span>
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">Todos</option>
            <option value="Unisex">Unisex</option>
            <option value="Hombre">Hombre</option>
            <option value="Mujer">Mujer</option>
          </select>
        </div>

        {/* Color Filter */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Color del Marco</span>
          <select
            value={colorFilter}
            onChange={(e) => setColorFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">Todos</option>
            <option value="Negro">Negro</option>
            <option value="Dorado">Dorado</option>
            <option value="Plata">Plata</option>
            <option value="Azul">Azul</option>
            <option value="Cafe">Café</option>
            <option value="Rojo">Rojo</option>
            <option value="Verde">Verde</option>
          </select>
        </div>

        {/* Stock Filter */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Inventario</span>
          <select
            value={stockFilter === undefined ? "" : stockFilter ? "true" : "false"}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "") setStockFilter(undefined);
              else setStockFilter(val === "true");
            }}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
          >
            <option value="">Todos</option>
            <option value="true">En Stock</option>
          </select>
        </div>
      </div>

      {/* Main content grid */}
      {isLoading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-3" />
          <p className="text-xs">Cargando catálogo de monturas...</p>
        </div>
      ) : isError ? (
        <div className="glass-panel rounded-2xl border border-rose-500/25 p-8 text-center text-rose-400">
          <p className="text-xs">Ocurrió un error al intentar cargar el catálogo. Por favor comprueba tu conexión.</p>
        </div>
      ) : (
        <MonturaGrid 
          monturas={monturas} 
          onAdjustStock={handleAdjustStock}
          isAdjusting={adjustStockMutation.isPending}
        />
      )}
    </div>
  );
}

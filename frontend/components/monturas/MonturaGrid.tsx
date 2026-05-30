"use client";

import { useState } from "react";
import { 
  Glasses, 
  Layers, 
  SlidersHorizontal, 
  Sparkles, 
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus
} from "lucide-react";
import { Montura } from "../../lib/types";
import { formatCurrency } from "../../utils/formatters";

interface MonturaGridProps {
  monturas: Montura[];
  onAdjustStock: (id: number, stock: number) => void;
  isAdjusting: boolean;
  isAdmin?: boolean;
}

export default function MonturaGrid({ monturas, onAdjustStock, isAdjusting, isAdmin = false }: MonturaGridProps) {
  const [editingStockId, setEditingStockId] = useState<number | null>(null);
  const [stockInput, setStockInput] = useState<number>(0);

  const startEditingStock = (montura: Montura) => {
    setEditingStockId(montura.idMontura);
    setStockInput(montura.stockMontura);
  };

  const saveStock = (id: number) => {
    onAdjustStock(id, stockInput);
    setEditingStockId(null);
  };

  // Helper for glasses placeholder SVGs to prevent empty images
  const getGlassSvg = (color: string) => {
    const strokeColor = color.toLowerCase() === "dorado" ? "stroke-yellow-500" :
                        color.toLowerCase() === "plata" ? "stroke-slate-300" :
                        color.toLowerCase() === "azul" ? "stroke-blue-400" :
                        color.toLowerCase() === "rojo" ? "stroke-rose-400" :
                        color.toLowerCase() === "verde" ? "stroke-emerald-400" :
                        "stroke-indigo-400";
                        
    return `<svg viewBox="0 0 100 60" fill="none" class="w-full h-full ${strokeColor}" stroke-width="2">
      <rect x="15" y="20" width="30" height="20" rx="10" />
      <rect x="55" y="20" width="30" height="20" rx="10" />
      <path d="M45 25 Q50 20 55 25" />
      <path d="M15 25 Q5 20 0 25" />
      <path d="M85 25 Q95 20 100 25" />
    </svg>`;
  };

  return (
    <div className="space-y-6">
      {/* Grid List */}
      {monturas.length === 0 ? (
        <div className="glass-panel rounded-2xl border border-slate-800/60 p-12 text-center text-slate-500">
          <Glasses className="w-12 h-12 mx-auto mb-4 text-slate-600" />
          <h3 className="text-lg font-bold text-slate-300">Catálogo Vacío</h3>
          <p className="text-xs text-slate-500 mt-1">No se encontraron monturas que coincidan con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monturas.map((montura) => {
            const isLowStock = montura.stockMontura > 0 && montura.stockMontura <= 8;
            const isNoStock = montura.stockMontura === 0;
            const isEditingThis = editingStockId === montura.idMontura;

            return (
              <div 
                key={montura.idMontura}
                className="glass-card rounded-2xl border border-slate-800/60 overflow-hidden flex flex-col group relative"
              >
                {/* SVG Product Preview */}
                <div className="h-44 bg-slate-950/40 relative flex items-center justify-center p-8 border-b border-slate-800/20">
                  <div 
                    className="w-40 h-24 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-all group-hover:scale-105 duration-300"
                    dangerouslySetInnerHTML={{ __html: getGlassSvg(montura.colorMontura) }}
                  />

                  {/* Stock Alert Badge */}
                  {isNoStock && (
                    <span className="absolute top-4 left-4 bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                      Sin Stock
                    </span>
                  )}
                  {isLowStock && (
                    <span className="absolute top-4 left-4 bg-amber-500/10 border border-amber-500/25 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Bajo Stock
                    </span>
                  )}

                  {/* Gender Tag */}
                  <span className="absolute top-4 right-4 bg-slate-800/60 backdrop-blur-md text-slate-300 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-slate-700/30 uppercase tracking-wide">
                    {montura.generoMontura}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Material & ID */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Ref: #{montura.idMontura}</span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                        <Layers className="w-3 h-3" />
                        {montura.material?.nombreMaterial || "Acetato"}
                      </span>
                    </div>

                    {/* Frame Name */}
                    <h3 className="font-bold text-slate-100 text-base mb-1 group-hover:text-indigo-400 transition-colors duration-200">
                      {montura.nombreMontura}
                    </h3>

                    {/* Specifications */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                      <span>Color: <strong className="text-slate-200 font-medium">{montura.colorMontura}</strong></span>
                    </div>
                  </div>

                  <div>
                    {/* Price and Stock Controls */}
                    <div className="flex items-end justify-between pt-4 border-t border-slate-800/40">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Precio Venta</p>
                        <p className="text-lg font-extrabold text-slate-100">{formatCurrency(montura.precioMontura)}</p>
                      </div>

                      {/* Stock Editor Box */}
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Inventario</p>
                        
                        {isEditingThis && isAdmin ? (
                          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-1 py-1 rounded-xl">
                            <button
                              onClick={() => setStockInput(Math.max(0, stockInput - 1))}
                              className="w-5 h-5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <input 
                              type="number"
                              value={stockInput}
                              onChange={(e) => setStockInput(parseInt(e.target.value) || 0)}
                              className="w-8 bg-transparent text-center text-xs font-bold text-slate-200 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              onClick={() => setStockInput(stockInput + 1)}
                              className="w-5 h-5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => saveStock(montura.idMontura)}
                              disabled={isAdjusting}
                              className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 ml-1 transition-colors"
                            >
                              Ok
                            </button>
                          </div>
                        ) : (
                          isAdmin ? (
                            <button
                              onClick={() => startEditingStock(montura)}
                              className="flex items-center gap-1 text-xs font-bold text-slate-300 hover:text-indigo-400 border border-transparent hover:border-slate-800 px-2 py-0.5 rounded-lg transition-all duration-200"
                              title="Ajustar Stock"
                            >
                              <span className={isNoStock ? "text-rose-400 font-extrabold" : isLowStock ? "text-amber-400 font-bold" : "text-slate-200"}>
                                {montura.stockMontura}
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">uds</span>
                              <RefreshCw className="w-3 h-3 text-slate-500 shrink-0 ml-1 group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5">
                              <span className={isNoStock ? "text-rose-400 font-extrabold" : isLowStock ? "text-amber-400 font-bold" : "text-slate-300"}>
                                {montura.stockMontura}
                              </span>
                              <span className="text-[10px] text-slate-500 font-normal">uds</span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { Sparkles, Layers, ShoppingCart, HelpCircle } from "lucide-react";
import { Recomendacion } from "../../lib/types";
import { formatCurrency } from "../../utils/formatters";

interface MonturaRecommendationCardProps {
  reco: Recomendacion;
  onBuy?: (idMontura: number, precio: number) => void;
}

export default function MonturaRecommendationCard({ reco, onBuy }: MonturaRecommendationCardProps) {
  const montura = reco.montura;
  if (!montura) return null;

  const score = reco.nivelCompatibilidad;
  
  // Custom score color mapping
  const scoreColor = score >= 90 
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" 
    : score >= 80 
      ? "text-indigo-400 bg-indigo-500/10 border-indigo-500/25" 
      : "text-amber-400 bg-amber-500/10 border-amber-500/25";

  // Simple glasses SVG helper
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
    <div className="glass-card rounded-2xl border border-slate-800/60 overflow-hidden flex flex-col group relative">
      {/* Compatibility Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${scoreColor}`}>
          <Sparkles className="w-3.5 h-3.5 shrink-0 animate-pulse" />
          {score}% Compatible
        </span>
      </div>

      {/* Frame Preview */}
      <div className="h-44 bg-slate-950/40 relative flex items-center justify-center p-8 border-b border-slate-800/20">
        <div 
          className="w-36 h-20 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-all group-hover:scale-105 duration-300"
          dangerouslySetInnerHTML={{ __html: getGlassSvg(montura.colorMontura) }}
        />
        
        <span className="absolute top-4 right-4 bg-slate-850/60 text-slate-400 text-[9px] font-semibold px-2 py-0.5 rounded-md border border-slate-800/40 uppercase">
          {montura.generoMontura}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Material & ID */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-slate-500 font-medium">Ref: #{montura.idMontura}</span>
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <Layers className="w-3 h-3 text-slate-500" />
              {montura.material?.nombreMaterial || "Acetato"}
            </span>
          </div>

          {/* Name */}
          <h4 className="font-bold text-slate-100 text-base mb-1 group-hover:text-indigo-400 transition-colors">
            {montura.nombreMontura}
          </h4>

          {/* Details */}
          <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
            <span>Color: <strong className="text-slate-200 font-medium">{montura.colorMontura}</strong></span>
            <span>Stock: <strong className={montura.stockMontura === 0 ? "text-rose-400" : "text-slate-200"}>{montura.stockMontura} uds</strong></span>
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/40 mt-auto">
          <div>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Precio</p>
            <p className="text-base font-extrabold text-slate-100">{formatCurrency(montura.precioMontura)}</p>
          </div>

          {onBuy && montura.stockMontura > 0 && (
            <button
              onClick={() => onBuy(montura.idMontura, Number(montura.precioMontura))}
              className="glow-btn flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-indigo-600/10"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Comprar
            </button>
          )}

          {montura.stockMontura === 0 && (
            <span className="text-xs font-semibold text-rose-400 bg-rose-500/5 border border-rose-500/10 px-3 py-1.5 rounded-xl">
              Agotado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { faceTypes } from "../../utils/faceTypes";
import { Sparkles } from "lucide-react";

interface FaceTypeSelectorProps {
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function FaceTypeSelector({ selectedId, onSelect }: FaceTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-slate-200">Selecciona el Tipo de Rostro</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Object.values(faceTypes).map((face) => {
          const isSelected = selectedId === face.id;

          return (
            <button
              key={face.id}
              onClick={() => onSelect(face.id)}
              className={`p-5 rounded-2xl flex flex-col items-center text-center transition-all duration-300 ${
                isSelected
                  ? "bg-indigo-600/15 border-2 border-indigo-500 shadow-[0_0_30px_-5px_rgba(99,102,241,0.25)] text-slate-100 scale-[1.02]"
                  : "bg-slate-900/40 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700/60"
              }`}
            >
              {/* SVG Icon */}
              <div 
                className={`mb-4 w-16 h-16 flex items-center justify-center transition-transform duration-300 ${
                  isSelected ? "scale-110 rotate-1" : "group-hover:scale-105"
                }`}
                dangerouslySetInnerHTML={{ __html: face.svgIcon }}
              />

              {/* Title & Description */}
              <h4 className="font-bold text-xs uppercase tracking-wider mb-1">
                {face.name}
              </h4>
              <p className="text-[9px] text-slate-500 leading-normal line-clamp-2">
                {face.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

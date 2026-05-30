"use client";

import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useClientes } from "../../../hooks/useClientes";
import { 
  FileText, 
  Download, 
  Clock, 
  CheckCircle,
  AlertCircle,
  FileCheck
} from "lucide-react";
import { formatDateTime } from "../../../utils/formatters";

export default function MiFormulaPage() {
  const { user } = useAuth();
  const { useGetClienteFormulas, useGetCliente } = useClientes();

  const clienteId = user?.idUsuario || 0;
  const { data: cliente, isLoading: loadingCliente } = useGetCliente(clienteId);
  const { data: formulas = [], isLoading: loadingFormulas } = useGetClienteFormulas(clienteId);

  const handleDownloadPDF = (formula: any) => {
    if (!user) return;
    
    const content = `==================================================
              OPTILOOK PREMIUM SUITE
              FÓRMULA ÓPTICA OFICIAL
==================================================
Paciente: ${user.primerNombre} ${user.segundoNombre || ""} ${user.primerApellido} ${user.segundoApellido || ""}
Identificación: #${user.idUsuario}
Dirección: ${user.direccion}
Correo: ${user.correoUsuario}
--------------------------------------------------
REGISTRO DE FÓRMULA:
Referencia de Fórmula: #FM-${formula.idFormula}
Fecha de Emisión: ${new Date(formula.fechaCarga).toLocaleDateString()}
Estado de Vigencia: ${formula.vigencia ? "VIGENTE Y ACTIVA" : "VENCIDA / HISTÓRICA"}
--------------------------------------------------
DIAGNÓSTICO Y OBSERVACIONES:
${formula.observacion}
--------------------------------------------------
Archivo PDF Asignado: ${formula.formulaPDF}
--------------------------------------------------
Este documento es una prescripción certificada por
el equipo de optometría de OptiLook Suite.
==================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `formula_optica_FM_${formula.idFormula}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loadingCliente || loadingFormulas) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-500 text-xs">
        <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2">Cargando prescripciones médicas...</span>
      </div>
    );
  }

  const activeFormula = cliente?.formula_actual;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <FileText className="w-7 h-7 text-indigo-400" />
          Mi Prescripción Óptica (formulaOf)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Visualiza los detalles técnicos y descarga en formato PDF la fórmula médica oficial provista por tu optómetra.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Active Formula panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 md:p-8 bg-slate-900/20 backdrop-blur-2xl space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2 border-b border-slate-800/40 pb-3">
              <FileCheck className="w-4.5 h-4.5 text-indigo-400" />
              Fórmula Médica Activa
            </h3>

            {activeFormula ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Referencia</span>
                    <strong className="text-sm text-slate-200 mt-1">#FM-{activeFormula.idFormula}</strong>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Estado de Vigencia</span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold mt-1.5 ${activeFormula.vigencia ? "text-emerald-400" : "text-rose-400"}`}>
                      <CheckCircle className="w-3.5 h-3.5" />
                      {activeFormula.vigencia ? "Vigente y Activa" : "Vencida"}
                    </span>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-2xl flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Cargada el</span>
                    <span className="text-xs text-slate-200 font-bold mt-1">{formatDateTime(activeFormula.fechaCarga)}</span>
                  </div>
                </div>

                <div className="space-y-2.5 bg-slate-950/40 border border-slate-850 p-5 rounded-2xl">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Diagnóstico y Observaciones</span>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap">{activeFormula.observacion}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-900 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Archivo Asociado</span>
                      <p className="text-xs text-slate-400 mt-1">{activeFormula.formulaPDF}</p>
                    </div>
                    
                    <button
                      onClick={() => handleDownloadPDF(activeFormula)}
                      className="glow-btn flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/15"
                    >
                      <Download className="w-4 h-4" />
                      Descargar Fórmula PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <AlertCircle className="w-12 h-12 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-500 italic">No hay una fórmula óptica registrada o activa para tu cuenta en este momento.</p>
                <p className="text-[10px] text-indigo-400">Por favor contacta al administrador de la sucursal para cargar tu fórmula.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Formula History */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl border border-slate-800/80 p-6 bg-slate-900/20 backdrop-blur-2xl flex flex-col h-full">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2 border-b border-slate-800/40 pb-3">
              <Clock className="w-4.5 h-4.5 text-slate-400" />
              Historial de Recetas
            </h3>

            {formulas.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-12 text-center">No posees fórmulas previas en nuestro historial.</p>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {formulas.map((formula) => {
                  const isActive = activeFormula?.idFormula === formula.idFormula;
                  return (
                    <div 
                      key={formula.idFormula}
                      className={`p-4 rounded-2xl border transition-all text-xs space-y-2.5 ${
                        isActive 
                          ? "bg-slate-950/80 border-indigo-500/20 shadow-md" 
                          : "bg-slate-950/40 border-slate-900 hover:border-slate-850"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strong className="text-slate-200">#FM-{formula.idFormula}</strong>
                          {isActive && (
                            <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">
                              Activa
                            </span>
                          )}
                        </div>
                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${formula.vigencia ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                          {formula.vigencia ? "Vigente" : "Vencida"}
                        </span>
                      </div>
                      
                      <p className="text-[11px] text-slate-400 line-clamp-2">{formula.observacion}</p>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 text-[10px]">
                        <span className="text-slate-500">{new Date(formula.fechaCarga).toLocaleDateString()}</span>
                        <button
                          onClick={() => handleDownloadPDF(formula)}
                          className="flex items-center gap-1 text-indigo-400 hover:underline hover:text-indigo-300 font-bold"
                        >
                          <Download className="w-3 h-3" /> Descargar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useClientes } from "../../../../hooks/useClientes";
import { useRecomendaciones } from "../../../../hooks/useRecomendaciones";
import { 
  User, 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Calendar, 
  Sparkles, 
  FileText,
  Clock,
  CheckCircle,
  Receipt,
  Glasses,
  Plus,
  Edit,
  Check,
  Download,
  Loader2,
  AlertCircle
} from "lucide-react";
import { getFaceDetail } from "../../../../utils/faceTypes";
import { formatCurrency, formatDateTime } from "../../../../utils/formatters";
import TransaccionBadge from "../../../../components/transacciones/TransaccionBadge";

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = parseInt(params.id as string) || 0;

  const { 
    useGetCliente, 
    useGetClienteTransacciones,
    useGetClienteFormulas,
    createFormulaMutation,
    updateFormulaMutation,
    activarFormulaMutation
  } = useClientes();
  const { useGetClienteRecomendaciones } = useRecomendaciones();

  const { data: cliente, isLoading: loadingCliente, isError: errorCliente } = useGetCliente(clienteId);
  const { data: transacciones = [], isLoading: loadingTx } = useGetClienteTransacciones(clienteId);
  const { data: recomendaciones = [], isLoading: loadingReco } = useGetClienteRecomendaciones(clienteId);
  const { data: formulas = [], isLoading: loadingFormulas } = useGetClienteFormulas(clienteId);

  // Form / Modal States for Prescription Management
  const [showFormulaModal, setShowFormulaModal] = useState(false);
  const [editingFormulaId, setEditingFormulaId] = useState<number | null>(null);
  const [formVigencia, setFormVigencia] = useState(true);
  const [formPDF, setFormPDF] = useState("");
  const [formObservacion, setFormObservacion] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  const handleDownloadPDF = (formula: any) => {
    if (!cliente) return;
    
    const content = `==================================================
              OPTILOOK PREMIUM SUITE
              FÓRMULA ÓPTICA OFICIAL
==================================================
Paciente: ${cliente.primerNombre} ${cliente.segundoNombre || ""} ${cliente.primerApellido} ${cliente.segundoApellido || ""}
Identificación: #${cliente.idUsuario}
Dirección: ${cliente.direccion}
Correo: ${cliente.correoUsuario}
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

  const handleSaveFormula = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPDF || !formObservacion) {
      alert("Por favor ingresa todos los campos obligatorios");
      return;
    }

    setFormLoading(true);
    try {
      if (editingFormulaId) {
        await updateFormulaMutation.mutateAsync({
          id: clienteId,
          formulaId: editingFormulaId,
          dto: {
            vigencia: formVigencia,
            formulaPDF: formPDF,
            observacion: formObservacion
          }
        });
        alert("¡Fórmula óptica actualizada con éxito!");
      } else {
        await createFormulaMutation.mutateAsync({
          id: clienteId,
          dto: {
            idFormula: 0,
            idUsuario: clienteId,
            vigencia: formVigencia,
            formulaPDF: formPDF,
            observacion: formObservacion
          }
        });
        alert("¡Fórmula óptica registrada con éxito!");
      }
      setShowFormulaModal(false);
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al guardar la fórmula");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setEditingFormulaId(null);
    setFormVigencia(true);
    setFormPDF("");
    setFormObservacion("");
  };

  const handleOpenEdit = (formula: any) => {
    setEditingFormulaId(formula.idFormula);
    setFormVigencia(formula.vigencia);
    setFormPDF(formula.formulaPDF);
    setFormObservacion(formula.observacion);
    setShowFormulaModal(true);
  };

  const handleActivar = async (formulaId: number) => {
    if (confirm("¿Estás seguro de que deseas activar esta fórmula como la actual para el cliente?")) {
      try {
        await activarFormulaMutation.mutateAsync({ id: clienteId, formulaId });
        alert("¡Fórmula establecida como ACTIVA con éxito!");
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error al activar la fórmula");
      }
    }
  };

  if (loadingCliente) {
    return (
      <div className="h-96 flex items-center justify-center text-slate-500 text-xs">
        <LoaderSpinner />
        <span className="ml-2">Cargando perfil de cliente...</span>
      </div>
    );
  }

  if (errorCliente || !cliente) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-xs text-indigo-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Volver atrás
        </button>
        <div className="glass-panel border-rose-500/25 p-8 text-center text-rose-400 rounded-2xl">
          El cliente no existe o fue eliminado de forma lógica del sistema.
        </div>
      </div>
    );
  }

  const face = getFaceDetail(cliente.idTipo);

  return (
    <div className="space-y-6">
      {/* Return link */}
      <button 
        onClick={() => router.push("/clientes")}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-400 font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Regresar al Panel de Clientes
      </button>

      {/* Main Profile Header */}
      <div className="glass-panel rounded-2xl border border-slate-800/60 p-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 bg-slate-900/30">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Circular avatar with initials */}
          <div className="w-20 h-20 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl font-black shadow-lg shadow-indigo-500/5">
            {cliente.primerNombre[0]}{cliente.primerApellido[0]}
          </div>

          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-black text-slate-100 leading-tight">
              {cliente.primerNombre} {cliente.segundoNombre} {cliente.primerApellido} {cliente.segundoApellido}
            </h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Cliente Registrado (Ref: #{cliente.idUsuario})</p>
            
            {/* Metadata badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-slate-500" />
                {cliente.correoUsuario}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-slate-500" />
                {cliente.direccion}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-slate-500" />
                Nacido: {cliente.fechaNacimiento}
              </span>
            </div>
          </div>
        </div>

        {/* Face Shape Badge */}
        {cliente.idTipo ? (
          <div className="bg-indigo-600/10 border border-indigo-500/20 p-4 rounded-2xl flex flex-col items-center md:items-end text-center md:text-right gap-1 max-w-xs shrink-0 shadow-inner">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase text-indigo-400 tracking-wider">
              <Sparkles className="w-4 h-4" />
              Rostro {face.name}
            </span>
            <p className="text-[10px] text-slate-400 mt-1">{face.description}</p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col items-center md:items-end text-center md:text-right gap-1 max-w-xs shrink-0">
            <span className="text-xs font-bold text-slate-500 italic">Rostro no evaluado</span>
            <button 
              onClick={() => router.push("/recomendaciones")}
              className="text-[10px] font-bold text-indigo-400 hover:underline mt-2"
            >
              Realizar Diagnóstico Visual ›
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Optical Formula and Recommendation History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Formula panel */}
          {/* Formula panel */}
          <div className="glass-panel rounded-2xl border border-slate-800/60 p-6 bg-slate-900/10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-indigo-400" />
                Gestión de Fórmulas Ópticas (formulaOf)
              </h3>
              <button
                onClick={() => { resetForm(); setShowFormulaModal(true); }}
                className="flex items-center gap-1 bg-indigo-600/15 border border-indigo-500/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-[10px] px-3 py-1.5 rounded-lg uppercase tracking-wider transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva Fórmula
              </button>
            </div>

            {/* Formula actual summary card */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Fórmula Activa Actualmente</p>
              {cliente.formula_actual ? (
                <div className="bg-gradient-to-r from-indigo-950/20 to-slate-950/40 border border-indigo-500/10 p-4 rounded-xl space-y-3 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">ID Fórmula:</span>
                      <strong className="text-xs text-indigo-300">#FM-{cliente.formula_actual.idFormula}</strong>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${cliente.formula_actual.vigencia ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
                      {cliente.formula_actual.vigencia ? "Vigente y Activa" : "Vencida"}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-semibold uppercase">Observaciones Diagnósticas</span>
                    <p className="text-xs text-slate-300 leading-relaxed">{cliente.formula_actual.observacion}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-900/60">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span className="text-[10px] text-slate-400">Cargada el: {formatDateTime(cliente.formula_actual.fechaCarga)}</span>
                    </div>
                    <button
                      onClick={() => handleDownloadPDF(cliente.formula_actual)}
                      className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar PDF ({cliente.formula_actual.formulaPDF})
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic py-3 text-center border border-dashed border-slate-850 rounded-2xl">
                  Este cliente no tiene una fórmula óptica activa.
                </p>
              )}
            </div>

            {/* List of all loaded formulas */}
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Historial de Fórmulas Cargadas ({formulas.length})</p>
              {loadingFormulas ? (
                <p className="text-xs text-slate-500 italic py-2">Cargando historial...</p>
              ) : formulas.length === 0 ? (
                <p className="text-xs text-slate-500 italic text-center py-4 border border-dashed border-slate-850 rounded-2xl bg-slate-950/20">No hay registros de fórmulas anteriores cargadas.</p>
              ) : (
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {formulas.map((formula) => {
                    const isActive = cliente.idFormulaActual === formula.idFormula;
                    return (
                      <div 
                        key={formula.idFormula} 
                        className={`p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between gap-4 ${
                          isActive 
                            ? "bg-slate-950/80 border-indigo-500/20 shadow-md" 
                            : "bg-slate-950/40 border-slate-900 hover:border-slate-850"
                        }`}
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-slate-200">#FM-{formula.idFormula}</strong>
                            <span className="text-[9px] text-slate-500">{new Date(formula.fechaCarga).toLocaleDateString()}</span>
                            {isActive && (
                              <span className="bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase">
                                Activa
                              </span>
                            )}
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${formula.vigencia ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                              {formula.vigencia ? "Vigente" : "Vencida"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">{formula.observacion}</p>
                          <p className="text-[9px] text-slate-500 flex items-center gap-1">
                            <FileText className="w-3 h-3 text-slate-500" /> {formula.formulaPDF}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {!isActive && (
                            <button
                              onClick={() => handleActivar(formula.idFormula)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-750 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-205 text-[10px] font-semibold transition-colors"
                              title="Establecer como Fórmula Activa"
                            >
                              Activar
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEdit(formula)}
                            className="w-8 h-8 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-indigo-400 flex items-center justify-center transition-colors"
                            title="Editar Observación / Vigencia"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDownloadPDF(formula)}
                            className="w-8 h-8 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-indigo-400 flex items-center justify-center transition-colors"
                            title="Descargar Fórmula en PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Recommendations History */}
          <div className="glass-panel rounded-2xl border border-slate-800/60 p-6 bg-slate-900/10">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Recomendaciones del Estratega de Rostro
            </h3>

            {loadingReco ? (
              <p className="text-xs text-slate-500 py-3 italic">Buscando catálogo de compatibilidades...</p>
            ) : recomendaciones.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-4">
                No se han calculado compatibilidades aún. Visita el panel de Recomendaciones.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recomendaciones.slice(0, 4).map((reco) => {
                  const m = reco.montura;
                  if (!m) return null;
                  
                  return (
                    <div key={reco.idRecomendacion} className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-xs text-slate-200">{m.nombreMontura}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Color: {m.colorMontura} | Gen: {m.generoMontura}</p>
                        <p className="text-[10px] text-slate-300 font-bold mt-1.5">{formatCurrency(m.precioMontura)}</p>
                      </div>
                      <span className="bg-indigo-600/15 border border-indigo-500/25 text-indigo-400 text-xs font-black px-2 py-1 rounded-lg">
                        {reco.nivelCompatibilidad}%
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Transaction Log */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl border border-slate-800/60 p-6 bg-slate-900/10 flex flex-col h-full">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-slate-400" />
              Historial de Órdenes
            </h3>

            {loadingTx ? (
              <p className="text-xs text-slate-500 py-3 italic">Cargando facturas de compras...</p>
            ) : transacciones.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center italic flex-1 flex flex-col items-center justify-center">
                El cliente no ha realizado transacciones comerciales.
              </p>
            ) : (
              <div className="space-y-3.5 overflow-y-auto max-h-[400px]">
                {transacciones.map((tx) => (
                  <div key={tx.idTransaccion} className="bg-slate-950/60 border border-slate-850 p-4.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-indigo-400">#TX-{tx.idTransaccion}</span>
                      <TransaccionBadge estado={tx.estadoTransaccion} />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-500">{formatDateTime(tx.fechaTransaccion)}</span>
                      <strong className="text-slate-200 font-extrabold">{formatCurrency(tx.totalTransaccion)}</strong>
                    </div>
                    
                    <p className="text-[9px] text-slate-500 pt-1 border-t border-slate-900/60 font-medium">Pago: {tx.metodoPago}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
      </div>

      {/* Formula Editor Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div>
              <h3 className="text-lg font-black text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                {editingFormulaId ? "Editar Fórmula Óptica" : "Cargar Nueva Fórmula Óptica"}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Completa los campos para persistir la prescripción del paciente en la tabla `formulaOf`.
              </p>
            </div>

            <form onSubmit={handleSaveFormula} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre del Archivo PDF *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. formula_paciente_101.pdf"
                  value={formPDF}
                  onChange={(e) => setFormPDF(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Diagnóstico / Observaciones *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ingresa la fórmula y detalles del diagnóstico..."
                  value={formObservacion}
                  onChange={(e) => setFormObservacion(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 placeholder-slate-600"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">¿Fórmula Vigente?</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormVigencia(true)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                      formVigencia 
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" 
                        : "border-slate-800 text-slate-400"
                    }`}
                  >
                    Vigente
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormVigencia(false)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                      !formVigencia 
                        ? "bg-rose-500/10 border-rose-500 text-rose-400" 
                        : "border-slate-800 text-slate-400"
                    }`}
                  >
                    Vencida
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/40">
                <button
                  type="button"
                  onClick={() => { setShowFormulaModal(false); resetForm(); }}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/15"
                >
                  {formLoading ? "Guardando..." : "Guardar Fórmula"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LoaderSpinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

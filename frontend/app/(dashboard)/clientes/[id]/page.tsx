"use client";

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
  Glasses
} from "lucide-react";
import { getFaceDetail } from "../../../../utils/faceTypes";
import { formatCurrency, formatDateTime } from "../../../../utils/formatters";
import TransaccionBadge from "../../../../components/transacciones/TransaccionBadge";

export default function ClienteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clienteId = parseInt(params.id as string) || 0;

  const { useGetCliente, useGetClienteTransacciones } = useClientes();
  const { useGetClienteRecomendaciones } = useRecomendaciones();

  const { data: cliente, isLoading: loadingCliente, isError: errorCliente } = useGetCliente(clienteId);
  const { data: transacciones = [], isLoading: loadingTx } = useGetClienteTransacciones(clienteId);
  const { data: recomendaciones = [], isLoading: loadingReco } = useGetClienteRecomendaciones(clienteId);

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
          <div className="glass-panel rounded-2xl border border-slate-800/60 p-6 bg-slate-900/10">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              Fórmula Óptica Actual
            </h3>

            {cliente.formula_actual ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">ID Fórmula</span>
                    <p className="text-xs font-bold text-slate-200 mt-1">#FM-{cliente.formula_actual.idFormula}</p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Vigencia</span>
                    <p className="text-xs font-bold mt-1 text-emerald-400">
                      {cliente.formula_actual.vigencia ? "Vigente y Activa" : "Vencida"}
                    </p>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-850 p-3 rounded-xl">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Fecha Carga</span>
                    <p className="text-xs font-bold text-slate-200 mt-1">
                      {formatDateTime(cliente.formula_actual.fechaCarga)}
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Diagnóstico / Observación</span>
                    <p className="text-xs text-slate-300 mt-1">{cliente.formula_actual.observacion}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase">Archivo Digital</span>
                    <p className="text-xs text-indigo-400 font-medium mt-1 hover:underline cursor-pointer flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      {cliente.formula_actual.formulaPDF}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic py-3 text-center">No se ha cargado ninguna prescripción para el usuario.</p>
            )}
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
      </div>
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

"use client";

import { useState } from "react";
import { useClientes } from "../../../hooks/useClientes";
import { useRecomendaciones } from "../../../hooks/useRecomendaciones";
import { useTransacciones } from "../../../hooks/useTransacciones";
import FaceTypeSelector from "../../../components/recomendaciones/FaceTypeSelector";
import MonturaRecommendationCard from "../../../components/recomendaciones/MonturaRecommendationCard";
import { getFaceDetail } from "../../../utils/faceTypes";
import { Sparkles, Users, Loader2, Sparkle, ShoppingBag } from "lucide-react";

export default function RecomendacionesPage() {
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [selectedFaceId, setSelectedFaceId] = useState<number | null>(null);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { useGetClientes } = useClientes();
  const { data: clientes = [], isLoading: loadingClientes } = useGetClientes();

  const { 
    useGetClienteRecomendaciones, 
    generarRecomendacionesMutation 
  } = useRecomendaciones();

  const { useGetMonturas } = useClientes();
  const { createTransaccionMutation } = useTransacciones();

  const { 
    data: recomendaciones = [], 
    isLoading: loadingRecos, 
    refetch: refetchRecos 
  } = useGetClienteRecomendaciones(selectedClienteId || 0);

  const handleCalculate = async () => {
    if (!selectedClienteId) {
      alert("Por favor, selecciona un cliente primero");
      return;
    }
    if (!selectedFaceId) {
      alert("Por favor, selecciona un tipo de rostro");
      return;
    }

    try {
      setLoadingMsg("Analizando facciones faciales...");
      setSuccessMsg(null);
      await generarRecomendacionesMutation.mutateAsync({
        idUsuario: selectedClienteId,
        idTipo: selectedFaceId,
      });
      setSuccessMsg("¡Estrategias de compatibilidad calculadas con éxito!");
      refetchRecos();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error al generar recomendaciones");
    } finally {
      setLoadingMsg(null);
    }
  };

  const handleBuy = async (idMontura: number, precio: number) => {
    if (!selectedClienteId) return;
    
    const cliente = clientes.find(c => c.idUsuario === selectedClienteId);
    if (!cliente) return;

    if (confirm("¿Deseas comprar esta montura? Se creará una transacción inmediata en estado Confirmada y se reducirá el stock.")) {
      try {
        setLoadingMsg("Procesando compra...");
        
        // Build CreateTransaccion DTO
        const txId = Math.floor(Math.random() * 899999) + 100000;
        await createTransaccionMutation.mutateAsync({
          idTransaccion: txId,
          idUsuario: selectedClienteId,
          direccionEnvio: cliente.direccion,
          metodoPago: "Tarjeta credito",
          tipoTransaccion: "Compra",
          detalles: [
            {
              idMontura: idMontura,
              lentesR: true,
              cantidadR: 1,
              precioUnitarioR: precio
            }
          ]
        });
        
        alert("¡Compra procesada con éxito! Revisa la pestaña de Transacciones para auditar el estado y stock.");
        refetchRecos();
      } catch (err) {
        alert(err instanceof Error ? err.message : "Error al procesar compra");
      } finally {
        setLoadingMsg(null);
      }
    }
  };

  const selectedCliente = clientes.find(c => c.idUsuario === selectedClienteId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-7 h-7 text-indigo-400" />
          Estratega de Recomendaciones
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Aplica algoritmos geométricos para evaluar y puntuar la compatibilidad del rostro de tus clientes con monturas en stock.
        </p>
      </div>

      {/* Main Form Control */}
      <div className="glass-panel rounded-2xl border border-slate-800/60 p-6 space-y-6 bg-slate-900/30">
        
        {/* Step 1: Client Selector */}
        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Users className="w-4 h-4 text-indigo-400" />
            1. Seleccionar Cliente de Evaluación
          </label>
          
          {loadingClientes ? (
            <p className="text-xs text-slate-500 italic">Buscando base de datos de clientes...</p>
          ) : (
            <select
              value={selectedClienteId || ""}
              onChange={(e) => {
                const val = parseInt(e.target.value) || null;
                setSelectedClienteId(val);
                
                // Pre-select customer face shape if they already have one computed
                const c = clientes.find(item => item.idUsuario === val);
                if (c && c.idTipo) {
                  setSelectedFaceId(c.idTipo);
                } else {
                  setSelectedFaceId(null);
                }
                setSuccessMsg(null);
              }}
              className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500/50"
            >
              <option value="">-- Elige un cliente para comenzar --</option>
              {clientes.map((c) => (
                <option key={c.idUsuario} value={c.idUsuario}>
                  {c.primerNombre} {c.primerApellido} (ID: #{c.idUsuario} {c.idTipo ? `— Rostro ${getFaceDetail(c.idTipo).name}` : "— Sin evaluar"})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Step 2: Face Selector */}
        {selectedClienteId && (
          <div className="pt-4 border-t border-slate-800/40 animate-in fade-in duration-300">
            <FaceTypeSelector 
              selectedId={selectedFaceId}
              onSelect={(id) => {
                setSelectedFaceId(id);
                setSuccessMsg(null);
              }}
            />
          </div>
        )}

        {/* Calculation Button */}
        {selectedClienteId && selectedFaceId && (
          <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Algoritmo del estratega</p>
              <p className="text-xs text-indigo-400 font-medium mt-1">
                {getFaceDetail(selectedFaceId).tips}
              </p>
            </div>

            <button
              onClick={handleCalculate}
              disabled={!!loadingMsg}
              className="glow-btn flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg shadow-indigo-600/15 text-nowrap"
            >
              {loadingMsg ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculando...
                </>
              ) : (
                <>
                  <Sparkle className="w-4 h-4" />
                  Calcular Monturas Compatibles
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Success notification */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/25 p-4 rounded-xl text-xs text-emerald-400">
          {successMsg}
        </div>
      )}

      {/* Loading Overlay */}
      {loadingMsg && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/50 backdrop-blur-sm">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-200">{loadingMsg}</p>
        </div>
      )}

      {/* Recommendations listing grid */}
      {selectedClienteId && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
            <h3 className="font-extrabold text-lg text-slate-200">
              Modelos de Monturas Sugeridas
            </h3>
            {selectedCliente && (
              <span className="text-xs text-slate-500 font-medium">
                Mostrando sugerencias para {selectedCliente.primerNombre}
              </span>
            )}
          </div>

          {loadingRecos ? (
            <div className="h-44 flex items-center justify-center text-slate-500 text-xs">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mr-2" />
              Buscando recomendaciones históricas...
            </div>
          ) : recomendaciones.length === 0 ? (
            <div className="glass-panel border-slate-800/60 p-8 text-center text-slate-500 rounded-2xl text-xs">
              Usa el botón de arriba para calcular y guardar las primeras monturas compatibles.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recomendaciones.map((reco) => (
                <MonturaRecommendationCard 
                  key={reco.idRecomendacion} 
                  reco={reco} 
                  onBuy={handleBuy}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

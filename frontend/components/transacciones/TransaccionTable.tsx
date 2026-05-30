"use client";

import { 
  ArrowRight, 
  X, 
  MapPin, 
  CreditCard, 
  Calendar,
  Receipt,
  User,
  CheckCircle,
  Truck,
  PackageCheck
} from "lucide-react";
import { Transaccion } from "../../lib/types";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import TransaccionBadge from "./TransaccionBadge";

interface TransaccionTableProps {
  transacciones: Transaccion[];
  onTransitionState: (id: number, nuevoEstado: string) => void;
  isTransitioning: boolean;
}

export default function TransaccionTable({ transacciones, onTransitionState, isTransitioning }: TransaccionTableProps) {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl">
      <div className="px-6 py-5 border-b border-slate-800/40 bg-slate-900/30">
        <h2 className="text-lg font-bold text-slate-100">Registro de Facturación</h2>
        <p className="text-xs text-slate-400 mt-1">
          Seguimiento de órdenes y control de estados comerciales (Patrón State).
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/40 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/20">
              <th className="py-4 px-6 font-semibold">Código Orden</th>
              <th className="py-4 px-6 font-semibold">Cliente</th>
              <th className="py-4 px-6 font-semibold">Detalles de Cobro</th>
              <th className="py-4 px-6 font-semibold">Estado</th>
              <th className="py-4 px-6 font-semibold text-center">Transicionar Estado (State Machine)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {transacciones.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-slate-500">
                  <Receipt className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                  No se encontraron transacciones en el sistema.
                </td>
              </tr>
            ) : (
              transacciones.map((tx) => {
                const estado = tx.estadoTransaccion.toLowerCase();
                const isTerminal = estado === "completada" || estado === "cancelada";

                return (
                  <tr key={tx.idTransaccion} className="hover:bg-slate-900/20 transition-colors">
                    {/* ID & Date */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-slate-200">#TX-{tx.idTransaccion}</span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                          {formatDateTime(tx.fechaTransaccion)}
                        </span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                          U
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-300">Cliente #{tx.idUsuario}</p>
                          <p className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-600" />
                            {tx.direccionEnvio}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-extrabold text-slate-100">{formatCurrency(tx.totalTransaccion)}</span>
                        <span className="flex items-center gap-1 text-[9px] text-slate-500 uppercase tracking-wider font-semibold">
                          <CreditCard className="w-3 h-3 text-slate-600 shrink-0" />
                          {tx.metodoPago}
                        </span>
                      </div>
                    </td>

                    {/* State badge */}
                    <td className="py-4 px-6">
                      <TransaccionBadge estado={tx.estadoTransaccion} />
                    </td>

                    {/* Transition Controls */}
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {isTerminal ? (
                          <span className="text-[10px] text-slate-600 italic">Ciclo Finalizado</span>
                        ) : (
                          <>
                            {/* Pendiente -> Confirmada */}
                            {estado === "pendiente" && (
                              <button
                                onClick={() => onTransitionState(tx.idTransaccion, "Confirmada")}
                                disabled={isTransitioning}
                                className="flex items-center gap-1 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 font-bold text-[10px] px-2.5 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                              >
                                <CheckCircle className="w-3 h-3" />
                                Confirmar
                              </button>
                            )}

                            {/* Confirmada -> Procesando */}
                            {estado === "confirmada" && (
                              <button
                                onClick={() => onTransitionState(tx.idTransaccion, "Procesando")}
                                disabled={isTransitioning}
                                className="flex items-center gap-1 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/20 font-bold text-[10px] px-2.5 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                              >
                                <Truck className="w-3 h-3" />
                                Procesar
                              </button>
                            )}

                            {/* Procesando -> Completada */}
                            {(estado === "procesando" || estado === "en preparacion") && (
                              <button
                                onClick={() => onTransitionState(tx.idTransaccion, "Completada")}
                                disabled={isTransitioning}
                                className="flex items-center gap-1 bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 font-bold text-[10px] px-2.5 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                              >
                                <PackageCheck className="w-3 h-3" />
                                Completar
                              </button>
                            )}

                            {/* Any non-terminal state -> Cancelar */}
                            <button
                              onClick={() => onTransitionState(tx.idTransaccion, "Cancelada")}
                              disabled={isTransitioning}
                              className="flex items-center gap-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 font-bold text-[10px] px-2.5 py-1.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                              title="Cancelar Transacción"
                            >
                              <X className="w-3 h-3" />
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

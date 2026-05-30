"use client";

import Link from "next/link";
import { 
  Eye, 
  Trash2, 
  UserPlus, 
  User, 
  MapPin, 
  Mail, 
  Sparkles 
} from "lucide-react";
import { Cliente } from "../../lib/types";
import { getFaceDetail } from "../../utils/faceTypes";

interface ClienteTableProps {
  clientes: Cliente[];
  onDelete: (id: number) => void;
  onOpenForm: () => void;
}

export default function ClienteTable({ clientes, onDelete, onOpenForm }: ClienteTableProps) {
  return (
    <div className="glass-panel rounded-2xl border border-slate-800/60 overflow-hidden shadow-2xl">
      {/* Table Header Controls */}
      <div className="px-6 py-5 border-b border-slate-800/40 flex items-center justify-between bg-slate-900/30">
        <div>
          <h2 className="text-lg font-bold text-slate-100">Clientes Registrados</h2>
          <p className="text-xs text-slate-400 mt-1">Gestión de datos demográficos y fórmulas oftálmicas de clientes.</p>
        </div>
        <button 
          onClick={onOpenForm}
          className="glow-btn flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/15"
        >
          <UserPlus className="w-4 h-4" />
          Registrar Cliente
        </button>
      </div>

      {/* Actual Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/40 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/20">
              <th className="py-4 px-6 font-semibold">Cliente</th>
              <th className="py-4 px-6 font-semibold">Contacto</th>
              <th className="py-4 px-6 font-semibold">Dirección</th>
              <th className="py-4 px-6 font-semibold">Tipo de Rostro</th>
              <th className="py-4 px-6 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/30">
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-slate-500">
                  <User className="w-8 h-8 mx-auto mb-3 text-slate-600" />
                  No se encontraron clientes registrados.
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => {
                const face = getFaceDetail(cliente.idTipo);
                return (
                  <tr key={cliente.idUsuario} className="hover:bg-slate-900/20 transition-colors">
                    {/* Name */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/40 flex items-center justify-center font-bold text-sm text-indigo-400 shadow-inner">
                          {cliente.primerNombre[0]}{cliente.primerApellido[0]}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-200">
                            {cliente.primerNombre} {cliente.primerApellido}
                          </p>
                          <p className="text-[10px] text-slate-500 font-medium">ID: #{cliente.idUsuario}</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-slate-300 text-xs">
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-500" />
                          {cliente.correoUsuario}
                        </span>
                        <span className="text-[10px] text-slate-500">Nac: {cliente.fechaNacimiento}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-4 px-6 text-slate-300 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        {cliente.direccion}
                      </span>
                    </td>

                    {/* Face Type */}
                    <td className="py-4 px-6">
                      {cliente.idTipo ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-indigo-500/10 bg-indigo-500/5 text-[10px] font-semibold text-indigo-400">
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          {face.name}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">No evaluado</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/clientes/${cliente.idUsuario}`}
                          className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/40 text-slate-400 hover:text-slate-100 hover:bg-slate-700 flex items-center justify-center transition-all duration-200"
                          title="Ver Perfil"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onDelete(cliente.idUsuario)}
                          className="w-8 h-8 rounded-lg bg-rose-950/20 border border-rose-500/10 text-rose-400 hover:text-rose-200 hover:bg-rose-900/30 flex items-center justify-center transition-all duration-200"
                          title="Eliminar Cliente"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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

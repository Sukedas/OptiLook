"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { X, Save } from "lucide-react";
import { CreateCliente } from "../../lib/types";
import { useEffect } from "react";

const clienteSchema = zod.object({
  idUsuario: zod.number().int().positive("ID debe ser un número entero positivo"),
  primerNombre: zod.string().min(1, "Primer nombre es requerido"),
  segundoNombre: zod.string().optional().default(""),
  primerApellido: zod.string().min(1, "Primer apellido es requerido"),
  segundoApellido: zod.string().optional().default(""),
  correoUsuario: zod.string().email("Correo electrónico inválido"),
  fechaNacimiento: zod.string().min(1, "Fecha de nacimiento es requerida"),
  direccion: zod.string().min(1, "Dirección es requerida"),
  contrasena: zod.string().min(4, "Contraseña debe tener al menos 4 caracteres"),
});

type ClienteFormValues = zod.infer<typeof clienteSchema>;

interface ClienteFormProps {
  onClose: () => void;
  onSubmit: (data: CreateCliente) => void;
  isLoading: boolean;
}

export default function ClienteForm({ onClose, onSubmit, isLoading }: ClienteFormProps) {
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      idUsuario: Math.floor(Math.random() * 89999) + 10000, // Safe default mock ID
      segundoNombre: "",
      segundoApellido: "",
    }
  });

  const handleFormSubmit = (values: ClienteFormValues) => {
    onSubmit({
      ...values,
      segundoNombre: values.segundoNombre || "",
      segundoApellido: values.segundoApellido || "",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800/60 flex items-center justify-between bg-slate-950/20">
          <h3 className="font-bold text-slate-100 text-sm tracking-wide uppercase">Registrar Nuevo Cliente</h3>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* ID */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">ID Cliente</label>
              <input 
                type="number" 
                {...register("idUsuario", { valueAsNumber: true })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
              {errors.idUsuario && <p className="text-[10px] text-rose-400 mt-1">{errors.idUsuario.message}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Correo Electrónico</label>
              <input 
                type="email" 
                placeholder="ejemplo@correo.com"
                {...register("correoUsuario")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
              {errors.correoUsuario && <p className="text-[10px] text-rose-400 mt-1">{errors.correoUsuario.message}</p>}
            </div>
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primer Nombre</label>
              <input 
                type="text" 
                {...register("primerNombre")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
              {errors.primerNombre && <p className="text-[10px] text-rose-400 mt-1">{errors.primerNombre.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Segundo Nombre</label>
              <input 
                type="text" 
                {...register("segundoNombre")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          {/* Last names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Primer Apellido</label>
              <input 
                type="text" 
                {...register("primerApellido")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
              {errors.primerApellido && <p className="text-[10px] text-rose-400 mt-1">{errors.primerApellido.message}</p>}
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Segundo Apellido</label>
              <input 
                type="text" 
                {...register("segundoApellido")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Birthday */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fecha Nacimiento</label>
              <input 
                type="date" 
                {...register("fechaNacimiento")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
              {errors.fechaNacimiento && <p className="text-[10px] text-rose-400 mt-1">{errors.fechaNacimiento.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Contraseña (Mín. 4 caracteres)</label>
              <input 
                type="password" 
                placeholder="••••••"
                {...register("contrasena")}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
              />
              {errors.contrasena && <p className="text-[10px] text-rose-400 mt-1">{errors.contrasena.message}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Dirección de Envío</label>
            <input 
              type="text" 
              placeholder="Calle Falsa 123"
              {...register("direccion")}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
            {errors.direccion && <p className="text-[10px] text-rose-400 mt-1">{errors.direccion.message}</p>}
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-800/60 flex items-center justify-end gap-3 bg-slate-950/20 -mx-6 -mb-6 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="glow-btn flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-lg"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "Guardando..." : "Guardar Cliente"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

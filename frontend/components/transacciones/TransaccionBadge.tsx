"use client";

import { 
  Clock, 
  Check, 
  Loader2, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";

interface TransaccionBadgeProps {
  estado: string;
}

export default function TransaccionBadge({ estado }: TransaccionBadgeProps) {
  const config: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    pendiente: {
      bg: "bg-amber-500/10 border-amber-500/25",
      text: "text-amber-400",
      icon: Clock,
      label: "Pendiente",
    },
    confirmada: {
      bg: "bg-blue-500/10 border-blue-500/25",
      text: "text-blue-400",
      icon: Check,
      label: "Confirmada",
    },
    procesando: {
      bg: "bg-purple-500/10 border-purple-500/25",
      text: "text-purple-400",
      icon: Loader2,
      label: "Procesando",
    },
    "en preparacion": {
      bg: "bg-purple-500/10 border-purple-500/25",
      text: "text-purple-400",
      icon: Loader2,
      label: "En Preparación",
    },
    completada: {
      bg: "bg-emerald-500/10 border-emerald-500/25",
      text: "text-emerald-400",
      icon: CheckCircle2,
      label: "Completada",
    },
    cancelada: {
      bg: "bg-rose-500/10 border-rose-500/25",
      text: "text-rose-400",
      icon: XCircle,
      label: "Cancelada",
    },
  };

  const key = estado.toLowerCase();
  const activeConfig = config[key] || {
    bg: "bg-slate-500/10 border-slate-500/25",
    text: "text-slate-400",
    icon: Clock,
    label: estado,
  };

  const Icon = activeConfig.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${activeConfig.bg} ${activeConfig.text}`}>
      <Icon className={`w-3.5 h-3.5 ${key === "procesando" || key === "en preparacion" ? "animate-spin" : ""}`} />
      {activeConfig.label}
    </span>
  );
}

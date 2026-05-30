import Link from "next/link";
import { Sparkles, Eye, ShieldCheck, Database, LayoutDashboard, ChevronRight } from "lucide-react";

export default async function Page() {
  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

  let health: any = null;
  let healthError: string | null = null;

  try {
    const res = await fetch(`${apiBase}/api/v1/health`, {
      cache: "no-store",
    });
    health = await res.json();
  } catch (err) {
    healthError =
      err instanceof Error ? err.message : "No se pudo obtener healthcheck";
  }

  const isHealthy = health?.status === "ok";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 select-none pointer-events-none"></div>

      <div className="w-full max-w-2xl text-center space-y-10 z-10">
        {/* Brand Logo and Title */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/30 animate-pulse">
            <Eye className="w-9 h-9 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              OptiLook Fullstack Suite
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Sistema inteligente de recomendación de monturas basado en morfología facial y gestión comercial integrada.
            </p>
          </div>
        </div>

        {/* Dashboard Entry Card */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800/80 shadow-2xl max-w-md mx-auto space-y-6">
          <div className="text-left space-y-1.5">
            <h3 className="font-bold text-slate-200 text-sm uppercase tracking-wider">Acceso al Panel</h3>
            <p className="text-xs text-slate-500">Ingresa a la consola administrativa de OptiLook.</p>
          </div>

          <Link 
            href="/clientes"
            className="glow-btn w-full py-4.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 group transition-all"
          >
            <LayoutDashboard className="w-4 h-4 text-white/90" />
            Acceder al Suite Administrativo
            <ChevronRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Diagnostics & Health Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
          {/* Health Status */}
          <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-850 flex items-start gap-3">
            <ShieldCheck className={`w-5 h-5 mt-0.5 shrink-0 ${isHealthy ? "text-emerald-400" : "text-rose-400"}`} />
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Servidor API</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">FastAPI Backend Status</p>
              <div className="mt-2.5">
                {isHealthy ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-400">
                    Online (OK)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/25 text-[10px] font-bold text-rose-400">
                    Desconectado
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-2xl border border-slate-850 flex items-start gap-3">
            <Database className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Base de Datos</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">PostgreSQL Engine</p>
              <div className="mt-2.5">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-bold text-indigo-400">
                  Postgres 16 Activa
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Info if Backend down */}
        {healthError && (
          <div className="max-w-md mx-auto bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl text-left space-y-1">
            <h4 className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Detalle del Error de Healthcheck</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono whitespace-pre-wrap">{healthError}</p>
          </div>
        )}
      </div>
    </main>
  );
}

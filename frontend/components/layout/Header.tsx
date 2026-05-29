"use client";

import { Bell, Search, Globe, ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  const getBreadcrumb = () => {
    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) return "Dashboard";
    return paths.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("  ›  ");
  };

  return (
    <header className="h-16 border-b border-slate-800/30 px-8 flex items-center justify-between sticky top-0 bg-slate-950/40 backdrop-blur-md z-40">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
        <span>OptiLook</span>
        <ChevronRight className="w-3 h-3 text-slate-700" />
        <span className="text-slate-200 font-semibold">{getBreadcrumb()}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative w-64 md:block hidden">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full bg-slate-900/40 border border-slate-800/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>

        {/* Action icons */}
        <button className="w-8 h-8 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors">
          <Globe className="w-4 h-4" />
        </button>

        <button className="w-8 h-8 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full absolute top-2.5 right-2.5 animate-pulse"></span>
        </button>
      </div>
    </header>
  );
}

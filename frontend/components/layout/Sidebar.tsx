"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Users, 
  Glasses, 
  Receipt, 
  Sparkles, 
  LayoutDashboard, 
  Eye
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/clientes", label: "Clientes", icon: Users },
    { href: "/monturas", label: "Monturas", icon: Glasses },
    { href: "/transacciones", label: "Transacciones", icon: Receipt },
    { href: "/recomendaciones", label: "Recomendaciones", icon: Sparkles },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800/60 backdrop-blur-xl h-screen sticky top-0 flex flex-col p-6">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Eye className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">OptiLook</h1>
          <span className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Premium Suite</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1.5">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive 
                  ? "bg-indigo-600/15 text-indigo-400 border border-indigo-500/10 font-semibold shadow-inner" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="mt-auto pt-6 border-t border-slate-800/40 px-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-semibold text-indigo-300">
            AD
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-300">Administrador</p>
            <p className="text-[10px] text-slate-500">OptiLook Staff</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Code2, Bug, Play, BookOpen, Layers, MessageSquare, Terminal, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Code Converter", path: "/converter", icon: Code2 },
  { name: "Debugger", path: "/debugger", icon: Bug },
  { name: "Visualizer", path: "/visualizer", icon: Play },
  { name: "Learn", path: "/learn", icon: BookOpen },
  { name: "OOPS", path: "/oops", icon: Layers },
  { name: "AI Tutor", path: "/tutor", icon: MessageSquare },
  { name: "Compiler", path: "/compiler", icon: Terminal },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r flex flex-col z-50">
      <div className="p-6">
        <Link href="/">
          <h1 className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Code2 className="w-8 h-8 text-violet-400" />
            CodeMorph
          </h1>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} href={item.path}>
              <span
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group ${
                  isActive
                    ? "text-white bg-white/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-transparent rounded-xl border-l-2 border-violet-500"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 z-10 ${isActive ? "text-violet-400" : "group-hover:text-violet-400 transition-colors"}`} />
                <span className="z-10 font-medium">{item.name}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg">
            U
          </div>
          <div>
            <p className="text-sm font-semibold text-white">User</p>
            <p className="text-xs text-slate-400">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

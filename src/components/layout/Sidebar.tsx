"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Map,
  Users,
  Truck,
  BrainCircuit,
  PieChart,
  Activity,
  LogOut,
  Settings,
  Star,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function Sidebar() {
  const location = usePathname()
  const { role, sidebarOpen, setSidebarOpen } = useAppStore()

  const navItems = {
    CITOYEN: [
      { href: "/citoyen/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/citoyen/nouveau-signalement", label: "Nouveau signalement", icon: PlusCircle },
      { href: "/citoyen/mes-signalements", label: "Mes signalements", icon: FileText },
      { href: "/citoyen/points", label: "Mes Points", icon: Star },
    ],
    ADMIN: [
      { href: "/admin/dashboard", label: "Mission Control", icon: LayoutDashboard },
      { href: "/admin/signalements", label: "Signalements", icon: FileText },
      { href: "/admin/missions", label: "Missions", icon: Activity },
      { href: "/admin/carte", label: "Smart Map", icon: Map },
      { href: "/admin/agents", label: "Agents", icon: Users },
      { href: "/admin/vehicules", label: "Véhicules", icon: Truck },
      { href: "/admin/validation-ia", label: "Validation IA", icon: BrainCircuit },
      { href: "/admin/analytiques", label: "Analytiques", icon: PieChart },
    ],
    AGENT: [
      { href: "/agent/dashboard", label: "Ma Tournée", icon: LayoutDashboard },
      { href: "/agent/missions",  label: "Mes Missions", icon: Activity },
    ],
  }

  const items = navItems[role] || []

  const closeOnNav = () => setSidebarOpen(false)

  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border/50 shrink-0">
        <Link href="/" onClick={closeOnNav} className="flex items-center gap-2 text-sidebar-primary font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-sidebar-primary text-primary-foreground rounded flex items-center justify-center shrink-0">
            <Map className="w-5 h-5" />
          </div>
          EcoCollect AI
        </Link>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
          Menu Principal
        </div>
        {items.map((item: any) => {
          const isActive = location === item.href || location.startsWith(`${item.href}/`)
          return (
            <Link key={item.href} href={item.href} onClick={closeOnNav}>
              <div className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group cursor-pointer",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 shrink-0",
                  isActive ? "text-sidebar-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/70"
                )} />
                {item.label}
              </div>
            </Link>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-sidebar-border/50 space-y-1 shrink-0">
        <Link href="/profil" onClick={closeOnNav}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all cursor-pointer">
            <Settings className="w-5 h-5 text-sidebar-foreground/50 shrink-0" />
            Paramètres
          </div>
        </Link>
        <Link href="/" onClick={closeOnNav}>
          <div className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all cursor-pointer">
            <LogOut className="w-5 h-5 text-sidebar-foreground/50 shrink-0" />
            Déconnexion
          </div>
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar — always visible */}
      <aside className="w-64 hidden md:flex flex-col border-r border-sidebar-border fixed left-0 top-0 bottom-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar — animated drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={closeOnNav}
            />
            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-72 z-50 md:hidden shadow-2xl"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
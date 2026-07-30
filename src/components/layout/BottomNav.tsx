import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Map,
  Users,
  Star,
  Truck,
} from "lucide-react"

const navByRole = {
  citoyen: [
    { href: "/citoyen/dashboard",          label: "Accueil",   icon: LayoutDashboard },
    { href: "/citoyen/nouveau-signalement", label: "Signaler",  icon: PlusCircle },
    { href: "/citoyen/mes-signalements",    label: "Dépôts",    icon: FileText },
    { href: "/citoyen/points",              label: "Points",    icon: Star },
  ],
  admin: [
    { href: "/admin/dashboard",    label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/signalements", label: "Rapports",  icon: FileText },
    { href: "/admin/carte",        label: "Carte",     icon: Map },
    { href: "/admin/agents",       label: "Agents",    icon: Users },
    { href: "/admin/vehicules",    label: "Flotte",    icon: Truck },
  ],
  agent: [
    { href: "/agent/dashboard",  label: "Tournée",   icon: LayoutDashboard },
    { href: "/agent/missions",   label: "Missions",  icon: FileText },
    { href: "/admin/carte",      label: "Carte",     icon: Map },
  ],
}

export function BottomNav() {
  const location = usePathname()
  const role = useAppStore(s => s.role)
  const items = navByRole[role] ?? []

  const activeIndex = items.findIndex(
    item => location === item.href || location.startsWith(item.href + "/")
  )

  return (
    /* Only render on mobile */
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm px-0">
      <div className="relative flex items-center justify-around bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl shadow-black/20 px-2 py-2 gap-1">
        {/* Sliding active pill */}
        {activeIndex >= 0 && (
          <motion.div
            className="absolute inset-y-2 rounded-xl bg-primary/10 border border-primary/20"
            layoutId="bottom-nav-pill"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{
              width: `calc(${100 / items.length}% - 8px)`,
              left: `calc(${(activeIndex / items.length) * 100}% + 4px)`,
            }}
          />
        )}

        {items.map((item, i) => {
          const isActive = i === activeIndex
          return (
            <Link key={item.href} href={item.href} className="flex-1 z-10">
              <div className={cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-xl transition-colors select-none",
                isActive ? "text-primary" : "text-muted-foreground active:text-foreground"
              )}>
                <item.icon
                  className={cn(
                    "transition-all duration-200",
                    isActive ? "w-5 h-5 stroke-[2.5]" : "w-5 h-5 stroke-[1.8]"
                  )}
                />
                <span className={cn(
                  "text-[10px] font-medium leading-none tracking-wide transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-60"
                )}>
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
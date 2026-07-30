"use client";
import * as React from "react";
import { mockReports } from "@/lib/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Eye,
  Search,
  Plus,
  BrainCircuit,
  MapPin,
  Calendar,
  Package,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const wasteIcon: Record<string, { bg: string; text: string; label: string }> = {
  Plastique: { bg: "bg-blue-100", text: "text-blue-700", label: "PLA" },
  Organique: { bg: "bg-green-100", text: "text-green-700", label: "ORG" },
  Construction: { bg: "bg-amber-100", text: "text-amber-700", label: "CON" },
  Électronique: { bg: "bg-violet-100", text: "text-violet-700", label: "ELE" },
  Ménager: { bg: "bg-gray-100", text: "text-gray-700", label: "MEN" },
  Dangereux: { bg: "bg-red-100", text: "text-red-700", label: "DAN" },
};

const priorityDot: Record<string, string> = {
  Critique: "bg-red-500",
  Haute: "bg-orange-500",
  Normale: "bg-blue-400",
  Basse: "bg-gray-400",
};

const tabStatusMap: Record<string, string | null> = {
  Tous: null,
  "En attente": "En attente",
  "En cours": "En cours",
  Complétés: "Complété",
  Rejetés: "Rejeté",
};

const tabs = Object.keys(tabStatusMap);

export default function MesSignalements() {
  const myReports = mockReports.filter((r) => r.citizenId === "CIT-001");
  const [filter, setFilter] = React.useState("Tous");
  const [search, setSearch] = React.useState("");

  const filteredReports = myReports.filter((r) => {
    const mapped = tabStatusMap[filter];
    if (mapped && r.status !== mapped) return false;
    const q = search.toLowerCase();
    if (
      q &&
      !r.address.toLowerCase().includes(q) &&
      !r.wasteType.toLowerCase().includes(q)
    )
      return false;
    return true;
  });

  const countFor = (tab: string) => {
    const mapped = tabStatusMap[tab];
    if (!mapped) return myReports.length;
    return myReports.filter((r) => r.status === mapped).length;
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 sm:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight truncate">
              Mes Signalements
            </h1>
            <p className="text-muted-foreground text-sm mt-1 truncate">
              {myReports.length} contributions · suivez l'avancement en temps
              réel
            </p>
          </div>
          <Button className="shrink-0 w-full sm:w-auto">
            <Link
              href="/citoyen/nouveau-signalement"
              className="flex items-center justify-center w-full"
            >
              <Plus className="w-4 h-4 mr-2 shrink-0" /> Nouveau
            </Link>
          </Button>
        </div>

        {/* Tabs + search */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Tabs container - FIXED */}
          <div className="relative flex-1 min-w-0 overflow-hidden">
            <div className="overflow-x-auto overflow-y-hidden pb-2 -mb-2 scrollbar-hide">
              <div className="flex gap-1.5 min-w-max">
                {tabs.map((tab) => {
                  const count = countFor(tab);
                  const active = filter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all border flex-shrink-0 ${
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-card border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {tab}
                      <span
                        className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ${
                          active
                            ? "bg-white/25 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Gradient fade on right - optional */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          </div>

          <div className="relative shrink-0 sm:w-56 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 bg-card h-10 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="popLayout">
          {filteredReports.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="w-7 h-7" />
              </div>
              <p className="font-semibold text-lg text-foreground">
                Aucun signalement trouvé
              </p>
              <p className="text-sm mt-1">
                Essayez un autre filtre ou modifiez votre recherche
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

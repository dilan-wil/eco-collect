"use client";

import * as React from "react";
import { missionsApi } from "@/lib/api"; // ajustez le chemin selon votre projet
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Navigation,
} from "lucide-react";
import { Mission } from "@/lib/types";
import { useAuth } from "@/contexts/auth-context";

// À adapter selon les statuts réels de votre base de données
const STATUS_MAP: Record<string, string> = {
  assignee: "Assigné",
  en_cours: "En cours",
  terminee: "Complété",
  planifiee: "Planifiée",
  annulee: "Annulée",
};

// Inverse pour filtrer
const STATUS_FILTER_MAP: Record<string, string[]> = {
  Toutes: Object.keys(STATUS_MAP),
  Assigné: ["assignee"],
  "En cours": ["en_cours"],
  Complété: ["terminee"],
};

const priorityColor: Record<string, string> = {
  Critique: "bg-red-100 text-red-700 border-red-200",
  Haute: "bg-amber-100 text-amber-700 border-amber-200",
  Normale: "bg-blue-50 text-blue-600 border-blue-200",
  Basse: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function AgentMissions() {
  const { user } = useAuth();

  const [missions, setMissions] = React.useState<Mission[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [tab, setTab] = React.useState("Toutes");
  const [search, setSearch] = React.useState("");

  // Chargement des missions
  React.useEffect(() => {
    const fetchMissions = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const { data } = await missionsApi.getByAgent(user.id);
        setMissions(data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des missions");
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, [user]);

  // Filtrer les missions selon l'onglet et la recherche
  const filtered = React.useMemo(() => {
    const statuses = STATUS_FILTER_MAP[tab] || STATUS_FILTER_MAP.Toutes;
    return missions.filter((mission) => {
      const statusKey = mission.statut; // champ dans la table missions
      if (!statuses.includes(statusKey)) return false;
      if (search) {
        const signalement = mission.signalement;
        const searchable =
          `${signalement?.adresse || ""} ${signalement?.categorie || ""}`.toLowerCase();
        if (!searchable.includes(search.toLowerCase())) return false;
      }
      return true;
    });
  }, [missions, tab, search]);

  // Compteurs par onglet
  const counts = React.useMemo(() => {
    const total = missions.length;
    const assigne = missions.filter((m) => m.statut === "planifiee").length;
    const enCours = missions.filter((m) => m.statut === "en_cours").length;
    const termine = missions.filter((m) => m.statut === "terminee").length;
    return {
      Toutes: total,
      Assigné: assigne,
      "En cours": enCours,
      Complété: termine,
    };
  }, [missions]);

  // Affichage des statuts traduits
  const getDisplayStatus = (statusKey: string) =>
    STATUS_MAP[statusKey] || statusKey;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
        <p className="font-medium">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* En-tête */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mes Missions</h1>
          <p className="text-muted-foreground mt-1">
            Historique et suivi de toutes vos interventions.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          {[
            {
              label: "En cours",
              value: counts["En cours"],
              color: "bg-blue-50 text-blue-700 border-blue-200",
            },
            {
              label: "Complétées",
              value: counts.Complété,
              color: "bg-green-50 text-green-700 border-green-200",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`border rounded-xl px-4 py-2 text-center ${s.color}`}
            >
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par adresse ou type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {Object.keys(STATUS_FILTER_MAP).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap border transition-colors ${
                tab === t
                  ? "bg-primary text-white border-primary"
                  : "bg-background border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {t}{" "}
              <span className="opacity-60 ml-0.5">
                ({counts[t as keyof typeof counts] ?? 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Liste des missions */}
      <div className="space-y-3">
        {filtered.map((mission, i) => {
          const signalement = mission.signalement;
          const statusKey = mission.statut;
          const displayStatus = getDisplayStatus(statusKey);
          const isActive = statusKey === "en_cours";
          const isDone = statusKey === "terminee";

          // Priorité : on la récupère du signalement, ou on met une valeur par défaut
          const priority = signalement?.priorite || "Normale";

          return (
            <motion.div
              key={mission.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <div
                className={`bg-card border rounded-2xl overflow-hidden transition-shadow hover:shadow-md ${
                  isActive ? "border-blue-300 ring-1 ring-blue-200" : ""
                }`}
              >
                {/* Bande de couleur selon le statut */}
                <div
                  className={`h-1 w-full ${
                    isDone
                      ? "bg-green-500"
                      : isActive
                        ? "bg-blue-500"
                        : "bg-amber-400"
                  }`}
                />
                <div className="p-4 md:p-5">
                  <div className="flex items-start gap-4">
                    {/* Icône */}
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isDone
                          ? "bg-green-100"
                          : isActive
                            ? "bg-blue-100"
                            : "bg-amber-100"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <Navigation className="w-5 h-5 text-amber-600" />
                      )}
                    </div>

                    {/* Informations */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-sm">
                          #{mission.id.slice(0, 8)}
                        </span>
                        <StatusBadge status={displayStatus} />
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            priorityColor[priority] || priorityColor.Normale
                          }`}
                        >
                          {priority === "critique" && (
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                          )}
                          {priority}
                        </span>
                      </div>
                      <p className="font-semibold">
                        {signalement?.categorie || "Type inconnu"} —{" "}
                        {signalement?.niveau_accumulation ||
                          "Volume non spécifié"}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-start gap-1.5 mt-1">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">
                          {signalement?.adresse || "Adresse non renseignée"}
                        </span>
                      </p>
                    </div>

                    {/* Action */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 45 min
                      </p>
                      {!isDone && (
                        <Link href={`/agent/missions/${mission.id}`}>
                          <Button
                            size="sm"
                            variant={isActive ? "default" : "outline"}
                            className="gap-1"
                          >
                            {isActive ? "Continuer" : "Détails"}{" "}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucune mission trouvée</p>
          </div>
        )}
      </div>
    </>
  );
}

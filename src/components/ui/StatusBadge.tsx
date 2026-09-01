import * as React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

// Mapping statut -> classes CSS (couleurs uniques)
const statusClasses: Record<string, string> = {
  // Missions
  planifiee: "bg-indigo-500 hover:bg-indigo-600 text-white",
  en_cours: "bg-blue-500 hover:bg-blue-600 text-white",
  terminee: "bg-green-500 hover:bg-green-600 text-white",
  annulee: "bg-red-500 hover:bg-red-600 text-white",
  en_retard: "bg-orange-500 hover:bg-orange-600 text-white",

  // Signalements
  nouveau: "bg-cyan-500 hover:bg-cyan-600 text-white",
  resolu: "bg-emerald-500 hover:bg-emerald-600 text-white",
  ferme: "bg-gray-500 hover:bg-gray-600 text-white",
  rejete: "bg-rose-500 hover:bg-rose-600 text-white",

  // Anciens / compatibilité
  assigné: "bg-sky-500 hover:bg-sky-600 text-white",
  "en attente": "bg-yellow-500 hover:bg-yellow-600 text-white",
  critique: "bg-red-600 hover:bg-red-700 text-white",
  validé: "bg-teal-500 hover:bg-teal-600 text-white",
  complété: "bg-green-600 hover:bg-green-700 text-white",
};

// Libellés en français (pour affichage)
const statusLabels: Record<string, string> = {
  planifiee: "Planifiée",
  en_cours: "En cours",
  terminee: "Terminée",
  annulee: "Annulée",
  en_retard: "En retard",
  nouveau: "Nouveau",
  resolu: "Résolu",
  ferme: "Fermé",
  rejete: "Rejeté",
  assigné: "Assigné",
  "en attente": "En attente",
  critique: "Critique",
  validé: "Validé",
  complété: "Complété",
};

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().trim();
  const label = statusLabels[normalized] || status;
  const classes =
    statusClasses[normalized] || "bg-gray-400 hover:bg-gray-500 text-white";

  return <Badge className={cn(classes)}>{label}</Badge>;
}

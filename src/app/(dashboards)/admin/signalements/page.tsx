"use client";
import * as React from "react";
import { mockReports } from "@/lib/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowUpDown,
  ChevronRight,
  MapPin,
  Calendar,
  Tag,
  AlertCircle,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { AssignModal } from "@/components/ui/AssignModal"; // Import du modal
import { Signalement } from "@/lib/types";

export default function SignalementsAdmin() {
  const { signalements } = useAppStore();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("Tous");
  const [selectedReport, setSelectedReport] =
    React.useState<Signalement | null>(null);
  const [showAssignModal, setShowAssignModal] = React.useState(false);

  // Map display labels → internal status values
  const filterMap: Record<string, string | null> = {
    Tous: null,
    Nouveaux: "nouveau",
    "En Cours": "en_cours",
    Resolus: "resolu",
    Fermés: "ferme",
    Réjetés: "rejete",
  };

  const filteredReports = signalements.filter((r) => {
    const mapped = filterMap[statusFilter];
    if (mapped === "__priority__" && r.priorite !== "critique") return false;
    if (mapped && mapped !== "__priority__" && r.statut !== mapped)
      return false;
    if (
      search &&
      !r.id.toLowerCase().includes(search.toLowerCase()) &&
      !r?.adresse?.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const handleOpenAssignModal = (report: Signalement) => {
    setSelectedReport(report);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedReport(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Gestion des Signalements
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {filteredReports.length} dépôt{filteredReports.length > 1 ? "s" : ""}{" "}
          sauvage{filteredReports.length > 1 ? "s" : ""} signalé
          {filteredReports.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-card border rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher par ID ou adresse..."
            className="pl-9 bg-background w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Buttons - Flex Wrap */}
      <div className="bg-card border rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Filter className="w-4 h-4" />
          <span>Filtrer par statut :</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Tous", "Nouveaux", "En Cours", "Resolus", "Fermés", "Réjetés"].map(
            (f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ),
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b uppercase tracking-wider text-xs">
              <tr>
                <th className="px-4 py-4 cursor-pointer hover:text-foreground">
                  <div className="flex items-center gap-1">
                    ID <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Localisation</th>
                <th className="px-4 py-4">Type / Volume</th>
                <th className="px-4 py-4">Statut</th>
                <th className="px-4 py-4">Analyse IA</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-4 py-4 font-mono text-xs">
                    {report.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-4 text-muted-foreground text-xs">
                    {new Date(report.date_creation).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground max-w-[180px] truncate">
                      {report.adresse}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {report.ville}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="font-medium text-sm">{report.categorie}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.niveau_accumulation}
                    </p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={report.statut} />
                      {report.priorite === "critique" && (
                        <Badge
                          variant="destructive"
                          className="text-[10px] px-1 py-0 shadow-none"
                        >
                          Critique
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {report.confiance_ia > 0 ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs font-medium">
                          <span
                            className={`w-2 h-2 rounded-full ${report.confiance_ia > 90 ? "bg-green-500" : "bg-amber-500"}`}
                          ></span>
                          {report.confiance_ia}%
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">
                        En attente
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {report.statut === "nouveau" && (
                        <Button
                          size="sm"
                          variant="default"
                          className=""
                          onClick={() => handleOpenAssignModal(report)}
                        >
                          Assigner
                        </Button>
                      )}
                      <Link href={`/admin/signalements/${report.id}`}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile/Tablet Cards */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow h-full"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">
                  #{report.id.slice(0, 8)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={report.statut} />
                  {report.priorite === "critique" && (
                    <Badge
                      variant="destructive"
                      className="text-[10px] px-1.5 py-0"
                    >
                      <AlertCircle className="w-3 h-3 mr-0.5" />
                      Critique
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Calendar className="w-3 h-3" />
                {new Date(report.date_creation).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                })}
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-2 mb-2">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium line-clamp-2">
                  {report.adresse}
                </p>
                <p className="text-xs text-muted-foreground">{report.ville}</p>
              </div>
            </div>

            {/* Type & Volume */}
            <div className="flex items-center gap-3 mb-2 text-sm">
              <div className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{report.categorie}</span>
              </div>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground">
                {report.niveau_accumulation}
              </span>
            </div>

            {/* IA Confidence */}
            {report.confiance_ia > 0 && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${report.confiance_ia > 90 ? "bg-green-500" : "bg-amber-500"}`}
                  ></span>
                  <span className="text-xs font-medium">
                    {report.confiance_ia}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    confiance IA
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t">
              {report.statut === "nouveau" && (
                <Button
                  size="sm"
                  variant="default"
                  className="h-7 text-xs"
                  onClick={() => handleOpenAssignModal(report)}
                >
                  Assigner
                </Button>
              )}
              <Link href={`/admin/signalements/${report.id}`}>
                <Button size="sm" variant="ghost" className="h-7 text-xs">
                  Voir détails <ChevronRight className="w-3 h-3 ml-0.5" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium">Aucun signalement trouvé</p>
            <p className="text-sm mt-1">
              Essayez de modifier vos filtres de recherche
            </p>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {showAssignModal && selectedReport && (
        <AssignModal report={selectedReport} onClose={handleCloseAssignModal} />
      )}
    </div>
  );
}

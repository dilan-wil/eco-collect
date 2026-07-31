"use client";
import * as React from "react";
import { mockReports, mockAgents, mockVehicles } from "@/lib/mockData";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { AIResultCard } from "@/components/ui/AIResultCard";
import { MapComponent } from "@/components/ui/MapComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Truck,
  Calendar,
  MapPin,
  AlertTriangle,
  PlayCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Signalement } from "@/lib/types";
import { signalementsApi } from "@/lib/api";
import Image from "next/image";

export default function SignalementDetailAdmin() {
  const navigate = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [report, setReport] = React.useState<Signalement | null>(null);
  const assignedAgent = report?.assigne_a
    ? mockAgents.find((a) => a.id === report.assigne_a)
    : null;
  const [showAssignDialog, setShowAssignDialog] = React.useState(false); // Just state for prototype UI
  const [assigned, setAssigned] = React.useState(report?.statut === "en_cours");

  React.useEffect(() => {
    async function getSignalement() {
      const { data } = await signalementsApi.getById(id);
      setReport(data);
    }
    getSignalement();
  }, [id]);

  const handleAssign = () => {
    setAssigned(true);
    setShowAssignDialog(false);
  };

  if (!report) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle>Signalements Non trouvés</EmptyTitle>
          <EmptyDescription>
            Le signalement que vous cherchez n'existe pas, veuillez retourner au
            panel.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            onClick={() => navigate.push("/admin")}
            variant="outline"
            size="sm"
          >
            Accueil
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate.push("/admin/signalements")}
          className="mb-4 text-muted-foreground -ml-4 hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Retour aux signalements
        </Button>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight">{report.id}</h1>
              <StatusBadge status={assigned ? "Assigné" : report.statut} />
              {report.priorite === "critique" && (
                <span className="px-2.5 py-0.5 rounded-full bg-destructive/10 text-destructive text-sm font-semibold border border-destructive/20 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Urgence Absolue
                </span>
              )}
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {report.adresse} ({report.ville})
            </p>
          </div>

          <div className="flex gap-3">
            {report.statut !== "resolu" && report.statut !== "rejete" && (
              <>
                <Button
                  variant="outline"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Rejeter
                </Button>
                {!assigned && (
                  <Button
                    onClick={() => setShowAssignDialog(true)}
                    className="gap-2"
                  >
                    <PlayCircle className="w-4 h-4" /> Assigner une mission
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showAssignDialog && (
        <div className="mb-8 p-6 bg-card border rounded-xl shadow-lg ring-1 ring-primary/20 animate-in fade-in slide-in-from-top-4">
          <h3 className="text-lg font-bold mb-4">
            Assigner une équipe d'intervention
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Agent disponible suggéré
                </label>
                <select className="w-full border rounded-md h-10 px-3 bg-background">
                  {mockAgents
                    .filter((a) => a.status === "Disponible")
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.completedMissions} missions)
                      </option>
                    ))}
                  <option>Assigner à n'importe quel agent</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Véhicule adapté (Capacité: {report.niveau_accumulation})
                </label>
                <select className="w-full border rounded-md h-10 px-3 bg-background">
                  {mockVehicles
                    .filter((v) => v.status === "Disponible")
                    .map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.type} - {v.registration}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="flex items-end justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setShowAssignDialog(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleAssign}>Confirmer l'assignation</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-64 w-full rounded-xl border bg-muted flex items-center justify-center text-4xl font-bold uppercase tracking-widest text-muted-foreground/50 overflow-hidden">
              {report.fichier_url ? (
                <Image
                  src={report?.fichier_url! ?? ""}
                  alt={report.categorie}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <span>{report.categorie} PHOTO</span>
              )}
            </div>
            <div className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider">
                    Détails du Signalement
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Soumis par</span>
                      <span className="font-medium text-primary">
                        Citoyen {report.id_utilisateur}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {new Date(report.date_creation).toLocaleString("fr-FR")}
                      </span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">
                        Type de déchet
                      </span>
                      <span className="font-medium">{report.categorie}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Volume estimé
                      </span>
                      <span className="font-medium">
                        {report.niveau_accumulation}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {assignedAgent || assigned ? (
                <Card className="shadow-sm border-primary/20 bg-primary/5">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm text-primary uppercase tracking-wider">
                      Mission Assignée
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {assignedAgent
                          ? assignedAgent.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                          : "MM"}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {assignedAgent?.name || "Marie Martin"}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <User className="w-3 h-3" /> Agent de collecte
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 border-t border-primary/10 pt-3">
                      <Truck className="w-3.5 h-3.5" /> Véhicule: Camion Benne
                      (AB-123-CD)
                    </div>
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight">
              Analyse IA Complète
            </h3>
            <AIResultCard
              confidence={report.confiance_ia}
              objects={["Done"]}
              accumulationLevel={report.niveau_accumulation}
              decision="Validation Automatique"
              reason="Correspondance forte avec le modèle de déchets urbains type 4."
              estimatedTime="30-45 minutes"
            />
          </div>
        </div>

        <div className="space-y-8">
          <div className="h-[300px] w-full border rounded-xl overflow-hidden shadow-sm relative">
            <MapComponent
              markers={[
                {
                  id: report.id,
                  lat: report.latitude ?? 0,
                  lng: report.longitude ?? 0,
                  color: "#EF4444",
                },
              ]}
              center={[report.latitude!, report.longitude!]}
              zoom={16}
              height="100%"
            />
          </div>

          <Card className="shadow-sm">
            <CardHeader className="p-5 border-b">
              <CardTitle className="text-base">
                Signalements à proximité (500m)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="p-4 hover:bg-muted/50 transition-colors cursor-pointer flex gap-3 items-center"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">
                        Dépôt Plastique
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        à 120m • Il y a 2h
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Grouper
                    </Button>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t bg-muted/20">
                <Button
                  variant="link"
                  size="sm"
                  className="text-primary text-xs"
                >
                  Ouvrir l'outil de clustering
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

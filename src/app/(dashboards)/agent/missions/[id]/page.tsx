"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { missionsApi } from "@/lib/api"; // chemin à ajuster
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { MapComponent } from "@/components/ui/MapComponent";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Clock,
  Zap,
  Trash2,
  Upload,
  PlayCircle,
  Flag,
  Phone,
  Loader2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Mission } from "@/lib/types";

// Mapping des statuts de la base vers l'affichage
const STATUS_MAP: Record<string, string> = {
  assignee: "Assigné",
  en_cours: "En cours",
  terminee: "Complété",
  planifiee: "Planifiée",
  annulee: "Annulée",
};

// Couleurs pour la priorité (identique à l'autre page)
const priorityColor: Record<string, string> = {
  Critique: "bg-red-100 text-red-700 border-red-200",
  Haute: "bg-amber-100 text-amber-700 border-amber-200",
  Normale: "bg-blue-50 text-blue-600 border-blue-200",
  Basse: "bg-slate-100 text-slate-600 border-slate-200",
};

// Mock photo citoyen (on pourrait utiliser l'URL du signalement si disponible)
const CITIZEN_PHOTOS = [
  "https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
];

export default function MissionDetail() {
  const router = useRouter();
  const params = useParams();
  const missionId = params.id as string;

  const [mission, setMission] = React.useState<Mission | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [cleanPhoto, setCleanPhoto] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [updating, setUpdating] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Chargement de la mission
  React.useEffect(() => {
    const fetchMission = async () => {
      if (!missionId) return;
      try {
        setLoading(true);
        // Récupérer toutes les missions avec leurs relations
        const { data } = await missionsApi.getAll();
        const found = data?.find((m: any) => m.id === missionId);
        if (!found) {
          setError("Mission introuvable");
        } else {
          setMission(found);
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, [missionId]);

  // Fonctions de mise à jour du statut
  const handleStart = async () => {
    if (!mission) return;
    setUpdating(true);
    try {
      const { data } = await missionsApi.updateStatut(mission.id, "en_cours");
      setMission((prev: any) => ({ ...prev, ...data }));
      toast.success("Mission démarrée — bonne intervention !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du démarrage");
    } finally {
      setUpdating(false);
    }
  };

  const handleComplete = async () => {
    if (!mission) return;
    if (!cleanPhoto) {
      toast.error("Prenez une photo du site nettoyé avant de valider");
      return;
    }
    setUpdating(true);
    try {
      const { data } = await missionsApi.updateStatut(mission.id, "terminee");
      setMission((prev: any) => ({ ...prev, ...data }));
      toast.success("Mission terminée ! +30 points gagnés 🎉");
      setTimeout(() => router.push("/agent/dashboard"), 1800);
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la finalisation");
    } finally {
      setUpdating(false);
    }
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCleanPhoto(URL.createObjectURL(file));
    toast.success("Photo ajoutée");
  };

  // Affichage du statut traduit
  const displayStatus = mission
    ? STATUS_MAP[mission.statut] || mission.statut
    : "";
  const isActive = mission?.statut === "en_cours";
  const isDone = mission?.statut === "terminee";

  // Récupération du signalement associé
  const signalement = mission?.signalement;

  // Priorité (par défaut Normale)
  const priority = signalement?.priorite || "Normale";

  // Photo du citoyen : on utilise soit fichier_url du signalement, soit une mock
  const citizenPhoto =
    signalement?.fichier_url ||
    CITIZEN_PHOTOS[
      Math.abs(missionId?.charCodeAt(4) || 0) % CITIZEN_PHOTOS.length
    ];

  // Coordonnées
  const lat = signalement?.latitude || 48.8566;
  const lng = signalement?.longitude || 2.3522;
  const mapMarkers = [{ id: missionId, lat, lng, color: "#3B82F6" }];

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (error || !mission) {
    return (
      <AppLayout>
        <div className="text-center py-12 text-destructive">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
          <p className="font-medium">{error || "Mission introuvable"}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/agent/dashboard")}
          >
            Retour au tableau de bord
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Back + title */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/agent/dashboard")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la tournée
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl font-bold">
                Mission {mission.id.slice(0, 8)}
              </h1>
              <StatusBadge status={displayStatus} />
              <span
                className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                  priorityColor[priority] || priorityColor.Normale
                }`}
              >
                {priority === "critique" && (
                  <AlertTriangle className="w-3 h-3 inline mr-0.5" />
                )}
                {priority}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {signalement?.categorie || "Type inconnu"} · Volume{" "}
              {signalement?.niveau_accumulation || "N/A"}
            </p>
          </div>
          <Button variant="outline" className="gap-2 shrink-0">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Navigation className="w-4 h-4" /> Naviguer
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-5">
        {/* Carte */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border shadow-sm"
        >
          <MapComponent
            markers={mapMarkers}
            height="280px"
            center={[lat, lng]}
            zoom={16}
          />
        </motion.div>

        {/* Adresse */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-card border rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold">
              {signalement?.adresse || "Adresse non renseignée"}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {signalement?.ville || ""}
            </p>
            <p className="text-xs font-mono text-muted-foreground">
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </p>
          </div>
          <a
            href={`https://maps.google.com/?q=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="outline" className="gap-1 shrink-0">
              <Navigation className="w-3.5 h-3.5" /> Y aller
            </Button>
          </a>
        </motion.div>

        {/* Photo du citoyen */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
            <Camera className="w-4 h-4" /> Photo du citoyen
          </h2>
          <div className="rounded-2xl overflow-hidden border shadow-sm relative">
            <img
              src={citizenPhoto}
              alt="Photo signalement"
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-2">
              {signalement?.objets_ia?.map((obj: string) => (
                <span
                  key={obj}
                  className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20"
                >
                  {obj}
                </span>
              ))}
            </div>
            {signalement?.confiance_ia && (
              <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" /> IA :{" "}
                {Math.round(signalement.confiance_ia * 100)}%
              </div>
            )}
          </div>
        </motion.div>

        {/* Détails de la mission */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: Trash2,
                label: "Type",
                value: signalement?.categorie || "Inconnu",
              },
              { icon: Flag, label: "Priorité", value: priority },
              {
                icon: Zap,
                label: "Volume",
                value: signalement?.niveau_accumulation || "N/A",
              },
              { icon: Clock, label: "Estimé", value: "45 min" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-card border rounded-xl p-3 text-center"
              >
                <item.icon className="w-4 h-4 mx-auto mb-1.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground mb-0.5">
                  {item.label}
                </p>
                <p className="font-bold text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Description */}
        {signalement?.description && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-muted/50 border rounded-xl p-4 text-sm text-muted-foreground"
          >
            <p className="font-semibold text-foreground mb-1">
              Notes du citoyen
            </p>
            {signalement.description}
          </motion.div>
        )}

        {/* Upload photo après nettoyage (seulement en cours) */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ delay: 0.22 }}
            >
              <h2 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Photo après nettoyage
              </h2>
              {cleanPhoto ? (
                <div className="rounded-2xl overflow-hidden border relative">
                  <img
                    src={cleanPhoto}
                    alt="Après nettoyage"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Photo ajoutée
                  </div>
                  <button
                    onClick={() => setCleanPhoto(null)}
                    className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full"
                  >
                    Changer
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const f = e.dataTransfer.files[0];
                    if (f) handleFileChange(f);
                  }}
                  onClick={() => fileRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-all
                    ${
                      dragOver
                        ? "border-primary bg-primary/5"
                        : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"
                    }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-sm">
                      Prendre une photo du site nettoyé
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Glissez ou cliquez pour sélectionner
                    </p>
                  </div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileChange(f);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boutons d'action */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="pb-4"
        >
          {mission?.statut === "planifiee" && (
            <Button
              className="w-full h-13 text-base gap-2 rounded-xl py-4 shadow-lg shadow-primary/20"
              onClick={handleStart}
              disabled={updating}
            >
              {updating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <PlayCircle className="w-5 h-5" />
              )}
              Démarrer l'intervention
            </Button>
          )}

          {isActive && (
            <div className="space-y-3">
              <Button
                onClick={handleComplete}
                className="w-full h-13 py-4 text-base gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                disabled={updating}
              >
                {updating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                Marquer comme terminée
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2 text-muted-foreground"
              >
                <Phone className="w-4 h-4" /> Contacter le superviseur
              </Button>
            </div>
          )}

          {isDone && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5 flex items-center gap-3 text-green-800 dark:text-green-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold">Mission accomplie !</p>
                <p className="text-sm opacity-80">
                  Cette mission a été complétée avec succès.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AppLayout>
  );
}

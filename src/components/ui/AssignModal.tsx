import * as React from "react";
import { Report, mockAgents, mockVehicles } from "@/lib/mockData";
import { useMissionStore } from "@/lib/missionStore";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  User,
  Truck,
  Star,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Fuel,
  Zap,
  ChevronRight,
  Package,
} from "lucide-react";
import { Agent, Signalement, Vehicule } from "@/lib/types";
import { agentsApi, missionsApi, signalementsApi, vehiculesApi } from "@/lib/api";

interface Props {
  report: Signalement;
  onClose: () => void;
}

const priorityColor: Record<string, string> = {
  Critique: "bg-red-100 text-red-700 border-red-200",
  Haute: "bg-orange-100 text-orange-700 border-orange-200",
  Normale: "bg-blue-50 text-blue-700 border-blue-200",
  Basse: "bg-slate-100 text-slate-600 border-slate-200",
};

const wasteColor: Record<string, string> = {
  Plastique: "bg-blue-100 text-blue-700",
  Organique: "bg-green-100 text-green-700",
  Construction: "bg-amber-100 text-amber-700",
  Électronique: "bg-violet-100 text-violet-700",
  Ménager: "bg-gray-100 text-gray-700",
  Dangereux: "bg-red-100 text-red-700",
};

export function AssignModal({ report, onClose }: Props) {
  const { assignReport } = useMissionStore();
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [vehicules, setVehicules] = React.useState<Vehicule[]>([]);
  const [selectedAgent, setSelectedAgent] = React.useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = React.useState<string | null>(
    null,
  );
  const [confirming, setConfirming] = React.useState(false);

  React.useEffect(() => {
    async function getAgents() {
      const { data } = await agentsApi.getAll();
      setAgents(data ?? []);
    }
    async function getVehicules() {
      const { data } = await vehiculesApi.getAll();
      setVehicules(data ?? []);
    }
    getAgents();
    getVehicules();
  }, []);

  const availableAgents = agents.filter((a) => a.statut !== "hors_service");
  const availableVehicles = vehicules.filter(
    (v) => v.statut !== "en_maintenance",
  );

  const handleConfirm = async () => {
    if (!selectedAgent || !selectedVehicle) {
      toast.error("Sélectionnez un agent et un véhicule");
      return;
    }
    setConfirming(true);
    try {
        await missionsApi.create({
            signalement_id: report.id,
            agent_id: selectedAgent,
            vehicule_id: selectedVehicle
        })
        await signalementsApi.updateStatus(report.id, "en_cours")
        const agent = agents.find(a => a.id === selectedAgent)
      toast.success(`Mission assignée à ${agent?.nom_complet} avec succès !`);
      onClose()
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setConfirming(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.97 }}
          transition={{ duration: 0.25 }}
          className="bg-card border rounded-t-3xl sm:rounded-3xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b shrink-0">
            <div>
              <h2 className="text-lg font-bold">Assigner la mission</h2>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                {report.id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Report summary */}
            <div className="rounded-2xl border bg-muted/30 p-4 flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${wasteColor[report.categorie] ?? "bg-gray-100 text-gray-700"}`}
              >
                {report.categorie.substring(0, 3).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-sm">{report.categorie}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColor[report.priorite]}`}
                  >
                    {report.priorite}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {report.niveau_accumulation}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {report.adresse}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {report.ville}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                {report.confiance_ia}%
              </div>
            </div>

            {/* Agent selection */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <User className="w-4 h-4" /> Choisir un agent
              </h3>
              <div className="space-y-2">
                {availableAgents.map((agent) => {
                  const isSelected = selectedAgent === agent.id;
                  const isBusy = agent.statut === "en_mission";
                  const agentMissions = mockAgents.filter(
                    (a) => a.id === agent.id,
                  ).length;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                            {agent.nom_complet
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <span
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${isBusy ? "bg-amber-500" : "bg-green-500"}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">
                              {agent.nom_complet}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isBusy ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}
                            >
                              {agent.statut}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-muted-foreground">
                              {agent.zone_intervention}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              4
                            </span>
                            <span className="text-xs text-muted-foreground">
                              0 missions
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vehicle selection */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Choisir un véhicule
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableVehicles.map((v) => {
                  const isSelected = selectedVehicle === v.id;
                  const fuelCls =
                    v.niveau_carburant > 50
                      ? "bg-green-500"
                      : v.niveau_carburant > 20
                        ? "bg-amber-500"
                        : "bg-red-500";
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVehicle(v.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">
                            {v.immatriculation}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {v.type}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Package className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground mr-2">
                          {v.capacite}
                        </span>
                        <Fuel className="w-3 h-3 text-muted-foreground" />
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${fuelCls}`}
                            style={{ width: `${v.niveau_carburant}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">
                          {v.niveau_carburant}%
                        </span>
                      </div>
                      {v.statut === "en_service" && (
                        <p className="text-[10px] text-amber-600 mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Déjà en service
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t bg-muted/20 flex items-center gap-3 shrink-0">
            <Button variant="ghost" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button
              className="flex-1 gap-2"
              disabled={!selectedAgent || !selectedVehicle || confirming}
              onClick={handleConfirm}
            >
              {confirming ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Assignation…
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Confirmer l'assignation
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

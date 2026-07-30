"use client";
import * as React from "react";
import { mockReports } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapComponent } from "@/components/ui/MapComponent";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { motion } from "framer-motion";
import {
  PlusCircle,
  MapPin,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
  Leaf,
  ChevronRight,
  Camera,
  Zap,
  Award,
  AlertCircle,
} from "lucide-react";
import { useAppStore } from "@/lib/store";
import { Signalement } from "@/lib/types";
import { signalementsApi } from "@/lib/api";

const USER_LEVEL = "Gardien Vert";

const wasteIcon: Record<string, string> = {
  Plastique: "♻️",
  Ménager: "🗑️",
  Organique: "🌱",
  Construction: "🏗️",
  Électronique: "💻",
  Dangereux: "⚠️",
};

function StatCard({ value, label, icon: Icon, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-card border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </motion.div>
  );
}

function ReportRow({ r, i }: { r: Signalement; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * i }}
    >
      <Link href={`/citoyen/signalements/${r.id}`}>
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
            {wasteIcon[r.categorie] ?? "📦"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{r.categorie}</p>
            <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {r.adresse}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <StatusBadge status={r.statut} />
            <span className="text-xs text-muted-foreground">
              {new Date(r.date_creation).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}

export default function CitizenDashboard() {
  const { user } = useAppStore();
  const [signalements, setSignalements] = React.useState<Signalement[]>([]);
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  React.useEffect(() => {
    async function getSignalements() {
      const { data, error } = await signalementsApi.getMine();
      setSignalements(data!);
      console.log("latitude : ", data![0].latitude);
    }
    getSignalements();
  }, []);

  const myReports = signalements;
  const pending = myReports.filter((r) => r.statut === "en_cours").length;
  const active = myReports.filter((r) =>
    ["nouveau", "en_cours"].includes(r.statut),
  ).length;
  const completed = myReports.filter((r) => r.statut === "resolu").length;

  const mapMarkers = myReports.map((r) => ({
    id: r.id,
    lat: r.latitude! ?? 0,
    lng: r.longitude! ?? 0,
    color:
      r.statut === "resolu"
        ? "#16A34A"
        : r.statut === "en_cours"
          ? "#F59E0B"
          : "#3B82F6",
  }));

  // Calculate the center from all signalements
  // Calculate the center from all signalements
  const getMapCenter = React.useMemo(() => {
    if (!signalements || signalements.length === 0) {
      return [4.0511, 9.7679] as [number, number]; // Default: Douala
    }

    const validReports = signalements.filter(
      (r) => r.latitude && r.longitude && r.latitude !== 0 && r.longitude !== 0,
    );

    if (validReports.length === 0) {
      return [4.0511, 9.7679] as [number, number];
    }

    const avgLat =
      validReports.reduce((sum, r) => sum + r.latitude!, 0) /
      validReports.length;
    const avgLng =
      validReports.reduce((sum, r) => sum + r.longitude!, 0) /
      validReports.length;

    return [avgLat, avgLng] as [number, number];
  }, [signalements]);

  return (
    <>
      {/* ── greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-0.5">
            {greeting} 👋
          </p>
          <div className="flex w-full justify-between">
            <h1 className="text-3xl font-black tracking-tight">
              {user?.nom_complet.trim().split(" ")[0]}
            </h1>
            <Link href="/citoyen/signalements/new">
              <Button className="gap-2 rounded-full h-11 px-6 shadow-lg shadow-primary/20">
                <PlusCircle className="w-4 h-4" /> Nouveau signalement
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── level / points banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Link href="/citoyen/points">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-5 flex items-center gap-4 mb-8 cursor-pointer hover:opacity-95 transition-opacity shadow-lg shadow-primary/20 group">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-black text-2xl">{user?.points}</span>
                <span className="text-white/70 text-sm">points</span>
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-medium ml-1">
                  {USER_LEVEL}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-2">
                <div className="bg-white rounded-full h-1.5 w-[70%]" />
              </div>
              <p className="text-white/70 text-xs mt-1">
                180 pts pour le prochain niveau
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
          </div>
        </Link>
      </motion.div>

      {/* ── stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          value={myReports.length}
          label="Total signalements"
          icon={Camera}
          color="bg-primary/10 text-primary"
          delay={0.1}
        />
        <StatCard
          value={pending}
          label="En attente"
          icon={Clock}
          color="bg-amber-100 text-amber-600"
          delay={0.15}
        />
        <StatCard
          value={active}
          label="En traitement"
          icon={Zap}
          color="bg-blue-100 text-blue-600"
          delay={0.2}
        />
        <StatCard
          value={completed}
          label="Collectés"
          icon={CheckCircle2}
          color="bg-green-100 text-green-600"
          delay={0.25}
        />
      </div>

      {/* ── main content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left — activity feed */}
        <div className="lg:col-span-3 space-y-6">
          {/* Recent activity */}
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-bold text-base">Signalements récents</h2>
              <Link href="/citoyen/signalements">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 gap-1"
                >
                  Voir tout <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
            <div className="p-2">
              {myReports.slice(0, 5).map((r, i) => (
                <ReportRow key={r.id} r={r} i={i} />
              ))}
            </div>
          </div>

          {/* Impact panel */}
          <div className="bg-card border rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-base mb-4 flex items-center gap-2">
              <Leaf className="w-4 h-4 text-green-600" /> Mon impact écologique
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  value: "45 kg",
                  label: "Plastique recyclé",
                  color: "bg-blue-50 text-blue-700",
                },
                {
                  value: "120 kg",
                  label: "Déchets organiques",
                  color: "bg-green-50 text-green-700",
                },
                {
                  value: "2 m²",
                  label: "Espace libéré",
                  color: "bg-violet-50 text-violet-700",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl p-3 text-center ${s.color}`}
                >
                  <p className="text-xl font-black">{s.value}</p>
                  <p className="text-xs font-medium mt-0.5 opacity-80">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {[
                { label: "Plastique", pct: 60, color: "bg-blue-500" },
                { label: "Organique", pct: 85, color: "bg-green-500" },
                { label: "Autres", pct: 35, color: "bg-violet-500" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-xs mb-1 text-muted-foreground">
                    <span>{b.label}</span>
                    <span className="font-medium">{b.pct}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <motion.div
                      className={`h-2 rounded-full ${b.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${b.pct}%` }}
                      transition={{ duration: 1, delay: 0.4 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Super citizen nudge */}
          <motion.div
            whileHover={{ y: -3 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-lg shadow-primary/20"
          >
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Star className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg mb-0.5">Super Citoyen 🏆</p>
                <p className="text-white/80 text-sm">
                  Vos signalements ont permis de collecter{" "}
                  <strong>{completed} dépôts</strong> ce mois-ci. Continuez
                  comme ça !
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right — map + tips */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h2 className="font-bold text-base">Mes signalements</h2>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
                  Collecté
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  En attente
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                  En cours
                </span>
              </div>
            </div>
            <MapComponent
              markers={mapMarkers}
              center={getMapCenter}
              height="320px"
            />
          </div>

          {/* Quick tips */}
          {/* <div className="bg-card border rounded-2xl shadow-sm p-5">
            <h2 className="font-bold text-base mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Conseils pour
              gagner plus de points
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: Camera,
                  tip: "Photo nette = +20 pts bonus",
                  done: true,
                },
                {
                  icon: AlertCircle,
                  tip: "Indiquer la priorité correcte",
                  done: true,
                },
                {
                  icon: MapPin,
                  tip: "Localisation précise aide les agents",
                  done: false,
                },
                {
                  icon: Zap,
                  tip: "Signalez rapidement = +10 pts vitesse",
                  done: false,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 text-sm p-2 rounded-lg ${t.done ? "opacity-50" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${t.done ? "bg-primary/10" : "bg-amber-50"}`}
                  >
                    <t.icon
                      className={`w-3.5 h-3.5 ${t.done ? "text-primary" : "text-amber-600"}`}
                    />
                  </div>
                  <span
                    className={
                      t.done
                        ? "line-through text-muted-foreground"
                        : "font-medium"
                    }
                  >
                    {t.tip}
                  </span>
                  {t.done && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary ml-auto shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
}

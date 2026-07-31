"use client";
import * as React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Zap,
  Trophy,
  Target,
  TrendingUp,
  Award,
  CheckCircle2,
  Camera,
  MapPin,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 2000];
const LEVEL_NAMES = [
  "Débutant",
  "Citoyen Actif",
  "Gardien Vert",
  "Champion",
  "Ambassadeur",
  "Légende",
];
const LEVEL_COLORS = [
  "from-slate-400 to-slate-500",
  "from-green-400 to-green-600",
  "from-blue-400 to-blue-600",
  "from-violet-400 to-violet-600",
  "from-amber-400 to-amber-600",
  "from-rose-400 to-rose-600",
];

const userPoints = 420;
const currentLevel = LEVEL_THRESHOLDS.findIndex(
  (t, i) =>
    userPoints >= t && userPoints < (LEVEL_THRESHOLDS[i + 1] ?? Infinity),
);
const nextThreshold =
  LEVEL_THRESHOLDS[currentLevel + 1] ?? LEVEL_THRESHOLDS[currentLevel];
const prevThreshold = LEVEL_THRESHOLDS[currentLevel];
const progress = Math.round(
  ((userPoints - prevThreshold) / (nextThreshold - prevThreshold)) * 100,
);

const BADGES = [
  {
    icon: Camera,
    label: "Photographe",
    desc: "10 signalements envoyés",
    earned: true,
  },
  {
    icon: CheckCircle2,
    label: "Fiable",
    desc: "IA valide 90%+ de vos photos",
    earned: true,
  },
  {
    icon: Zap,
    label: "Rapide",
    desc: "5 signalements en 1 jour",
    earned: true,
  },
  {
    icon: MapPin,
    label: "Explorateur",
    desc: "3 quartiers différents",
    earned: false,
  },
  {
    icon: Trophy,
    label: "Top Contributeur",
    desc: "Top 10 du mois",
    earned: false,
  },
  {
    icon: Share2,
    label: "Ambassadeur",
    desc: "Partagez l'app 3×",
    earned: false,
  },
];

const HISTORY = [
  {
    label: "Signalement validé par l'IA",
    pts: +50,
    date: "Aujourd'hui",
    color: "text-green-600",
  },
  {
    label: "Signalement collecté",
    pts: +30,
    date: "Hier",
    color: "text-green-600",
  },
  {
    label: "Badge Photographe débloqué",
    pts: +100,
    date: "2 jours",
    color: "text-violet-600",
  },
  {
    label: "Signalement validé par l'IA",
    pts: +50,
    date: "3 jours",
    color: "text-green-600",
  },
  {
    label: "Bonus photo de qualité",
    pts: +20,
    date: "5 jours",
    color: "text-blue-600",
  },
  {
    label: "Signalement validé par l'IA",
    pts: +50,
    date: "1 sem.",
    color: "text-green-600",
  },
];

export default function Points() {
  const { user } = useAppStore();

  const LEADERBOARD = [
    { name: "Marie T.", pts: 1240, rank: 1 },
    { name: "Luc B.", pts: 890, rank: 2 },
    { name: "Chloé M.", pts: 730, rank: 3 },
    { name: "Vous", pts: user?.points, rank: 4, isYou: true },
    { name: "Paul D.", pts: 0, rank: 5 },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mes Points</h1>
        <p className="text-muted-foreground mt-1">
          Gagnez des points en contribuant à la propreté de Douala.
        </p>
      </div>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${LEVEL_COLORS[currentLevel]} p-8 text-white shadow-2xl`}
      >
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-3">
              <Award className="w-4 h-4" /> {LEVEL_NAMES[currentLevel]}
            </div>
            <div className="text-6xl font-black mb-1">{user?.points}</div>
            <div className="text-white/80 text-sm">points accumulés</div>
          </div>
          <div className="md:text-right">
            <p className="text-sm text-white/70 mb-2">
              Prochain niveau :{" "}
              <strong className="text-white">
                {LEVEL_NAMES[currentLevel + 1]}
              </strong>
            </p>
            <p className="text-sm text-white/70 mb-3">
              {nextThreshold - userPoints} pts restants
            </p>
            <div className="w-full md:w-48 bg-white/20 rounded-full h-2.5">
              <motion.div
                className="h-2.5 bg-white rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </div>
            <p className="text-xs text-white/60 mt-1">
              {progress}% vers {LEVEL_NAMES[currentLevel + 1]}
            </p>
          </div>
        </div>
      </motion.div>

      {/* How to earn */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Camera,
            label: "Signaler",
            desc: "+50 pts par signalement validé",
            color: "bg-green-50 text-green-700 border-green-200",
          },
          {
            icon: CheckCircle2,
            label: "Qualité",
            desc: "+20 pts bonus photo nette",
            color: "bg-blue-50  text-blue-700  border-blue-200",
          },
          {
            icon: Trophy,
            label: "Badge",
            desc: "+100 pts par badge débloqué",
            color: "bg-violet-50 text-violet-700 border-violet-200",
          },
        ].map((item) => (
          <motion.div
            key={item.label}
            whileHover={{ y: -3 }}
            className={`border rounded-2xl p-5 flex items-start gap-3 ${item.color}`}
          >
            <div className="w-9 h-9 rounded-xl bg-current/10 flex items-center justify-center shrink-0 opacity-80">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">{item.label}</p>
              <p className="text-xs opacity-75 mt-0.5">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Badges */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" /> Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {BADGES.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card
                  className={`text-center p-5 transition-all ${badge.earned ? "border-primary/30 shadow-sm" : "opacity-40 grayscale"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center ${badge.earned ? "bg-primary/10" : "bg-muted"}`}
                  >
                    <badge.icon
                      className={`w-6 h-6 ${badge.earned ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <p className="font-bold text-sm">{badge.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {badge.desc}
                  </p>
                  {badge.earned && (
                    <div className="mt-2 text-xs font-medium text-primary">
                      ✓ Obtenu
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sidebar: history + leaderboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" /> Historique
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              {HISTORY.map((h, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-3 border-b last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{h.label}</p>
                    <p className="text-xs text-muted-foreground">{h.date}</p>
                  </div>
                  <span className={`font-bold text-sm ${h.color}`}>
                    +{h.pts}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" /> Classement du mois
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 p-0">
              {LEADERBOARD.map((u) => (
                <div
                  key={u.rank}
                  className={`flex items-center gap-3 px-6 py-3 border-b last:border-0 ${u.isYou ? "bg-primary/5" : ""}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${u.rank === 1 ? "bg-amber-100 text-amber-700" : u.rank === 2 ? "bg-slate-100 text-slate-600" : u.rank === 3 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"}`}
                  >
                    {u.rank}
                  </div>
                  <span
                    className={`flex-1 text-sm font-medium ${u.isYou ? "text-primary" : ""}`}
                  >
                    {u.name}
                  </span>
                  <span className="text-sm font-bold">{u.pts} pts</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

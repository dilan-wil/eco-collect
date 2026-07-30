"use client";
import * as React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Leaf,
  ArrowRight,
  BrainCircuit,
  Truck,
  Users,
  MapPin,
  Zap,
  ShieldCheck,
  BarChart3,
  ChevronRight,
  Circle,
  CheckCircle2,
  Star,
  Clock,
} from "lucide-react";

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = React.useRef(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1600;
    const step = 16;
    const inc = to / (duration / step);
    const timer = setInterval(() => {
      start += inc;
      if (start >= to) {
        setVal(to);
        clearInterval(timer);
      } else setVal(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
}

// ─── Live feed ticker ─────────────────────────────────────────────────────────
const FEED = [
  { type: "Plastique", arr: "2ème", ago: "il y a 2 min", color: "bg-blue-500" },
  {
    type: "Construction",
    arr: "1er",
    ago: "il y a 5 min",
    color: "bg-amber-500",
  },
  {
    type: "Organique",
    arr: "5ème",
    ago: "il y a 8 min",
    color: "bg-green-500",
  },
  {
    type: "Électronique",
    arr: "3ème",
    ago: "il y a 12 min",
    color: "bg-violet-500",
  },
  { type: "Ménager", arr: "6ème", ago: "il y a 15 min", color: "bg-gray-400" },
  { type: "Dangereux", arr: "9ème", ago: "il y a 19 min", color: "bg-red-500" },
];

function LiveTicker() {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % FEED.length), 3000);
    return () => clearInterval(t);
  }, []);

  const item = FEED[idx];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-3"
      >
        <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
        <span className="text-white/70 text-sm">
          Nouveau signalement{" "}
          <span className="text-white font-semibold">{item.type}</span> ·
          Arrondissement {item.arr}
        </span>
        <span className="text-white/40 text-xs ml-auto shrink-0">
          {item.ago}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Floating orbs background ─────────────────────────────────────────────────
function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(22,163,74,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.07) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Orbs */}
      {[
        { w: 500, x: "70%", y: "-10%", c: "#16A34A", dur: 12 },
        { w: 350, x: "10%", y: "40%", c: "#2563EB", dur: 16 },
        { w: 280, x: "85%", y: "60%", c: "#16A34A", dur: 20 },
        { w: 200, x: "40%", y: "80%", c: "#8B5CF6", dur: 14 },
      ].map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[120px]"
          style={{
            width: o.w,
            height: o.w,
            left: o.x,
            top: o.y,
            backgroundColor: o.c,
            opacity: 0.18,
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.18, 0.22, 0.18] }}
          transition={{ duration: o.dur, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

// ─── Role card ────────────────────────────────────────────────────────────────
function RoleCard({
  role,
  label,
  desc,
  href,
  gradient,
  icon: Icon,
  features,
  delay,
}: {
  role: "CITOYEN" | "ADMIN" | "AGENT";
  label: string;
  desc: string;
  href: string;
  gradient: string;
  icon: React.ElementType;
  features: string[];
  delay: number;
}) {
  const { setRole } = useAppStore();
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative"
    >
      <Link href={href} onClick={() => setRole(role)}>
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer h-full flex flex-col">
          {/* Gradient header */}
          <div className={`${gradient} p-8 relative overflow-hidden`}>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-5 backdrop-blur-sm">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{label}</h3>
              <p className="text-white/80 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>

          {/* Features */}
          <div className="p-6 flex flex-col flex-1 justify-between gap-6">
            <ul className="space-y-3">
              {features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-sm text-white/70"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-white font-semibold text-sm group-hover:text-primary transition-colors">
              Accéder{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────
function StepCard({
  n,
  title,
  desc,
  icon: Icon,
  color,
}: {
  n: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="flex gap-6 items-start"
    >
      <div
        className={`shrink-0 w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg`}
      >
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <span className="text-xs font-black uppercase tracking-[0.15em] text-white/30 mb-1 block">
          Étape {n}
        </span>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/60 leading-relaxed text-sm">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function LandingPage() {
  const { setRole } = useAppStore();
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#080F0A] text-white flex flex-col">
      {/* ── Navbar ── */}
      <header className="fixed top-0 w-full z-50 border-b border-white/8 backdrop-blur-xl bg-[#080F0A]/80">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-18 flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tight">
              EcoKamer<span className="text-primary">.ai</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {[
              ["#fonctionnalites", "Fonctionnalités"],
              ["#comment", "Comment ça marche"],
              ["#impact", "Impact"],
            ].map(([h, l]) => (
              <a
                key={h}
                href={h}
                className="text-white/50 hover:text-white transition-colors"
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="ghost"
                className="hidden md:flex text-white/70 hover:text-white hover:bg-white/10 rounded-full px-5"
              >
                Connexion
              </Button>
            </Link>
            <Link href="/register">
              <Button className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                Commencer <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section className="relative min-h-screen flex flex-col justify-center pt-18 overflow-hidden">
          <HeroBackground />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-20 pb-12">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-primary text-sm font-semibold mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Plateforme de gestion intelligente des déchets · Lyon
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[88px] font-black tracking-tight leading-[1.0] mb-8 max-w-5xl"
            >
              La ville propre
              <br />
              <span className="relative inline-block">
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, #16A34A 0%, #4ADE80 40%, #2563EB 100%)",
                  }}
                >
                  commence par vous.
                </span>
                {/* Underline decoration */}
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 400 14"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M2 10 Q100 2 200 8 Q300 14 398 6"
                    stroke="url(#uline)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.9, delay: 0.9, ease: "easeOut" }}
                  />
                  <defs>
                    <linearGradient
                      id="uline"
                      x1="0"
                      y1="0"
                      x2="400"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#16A34A" />
                      <stop offset="1" stopColor="#2563EB" />
                    </linearGradient>
                  </defs>
                </motion.svg>
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg md:text-xl text-white/55 max-w-2xl leading-relaxed mb-10"
            >
              EcoKamer AI connecte les citoyens, les agents de collecte et les
              administrateurs dans une plateforme unifiée, propulsée par
              l'intelligence artificielle.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap gap-4 mb-16"
            >
              <Link href="/login">
                <Button
                  size="lg"
                  className="rounded-full h-14 px-8 text-base bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30"
                >
                  Faire un signalement
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-14 px-8 text-base border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  Voir Mission Control
                </Button>
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-8 mb-16"
            >
              {[
                { n: 12450, s: "+", label: "Signalements traités" },
                { n: 87, s: "%", label: "Validés par IA" },
                { n: 93, s: "%", label: "Taux de succès" },
                { n: 45, s: "", label: "Agents actifs" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-3xl font-black text-white">
                    <Counter to={s.n} suffix={s.s} />
                  </span>
                  <span className="text-xs text-white/40 font-medium uppercase tracking-wider mt-0.5">
                    {s.label}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Live ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="border border-white/10 bg-white/5 backdrop-blur rounded-2xl px-5 py-3.5 max-w-lg"
            >
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
                  Activité en direct
                </span>
              </div>
              <LiveTicker />
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="relative z-10 flex justify-center pb-10"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1 text-white/20 cursor-default select-none"
            >
              <span className="text-[10px] uppercase tracking-widest font-semibold">
                Découvrir
              </span>
              <div className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* ── ROLES ── */}
        <section
          id="fonctionnalites"
          className="py-32 px-6 md:px-10 bg-[#080F0A]"
        >
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3 block">
                Trois rôles. Un écosystème.
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white max-w-xl leading-tight">
                Chaque acteur a sa place
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <RoleCard
                role="CITOYEN"
                label="Citoyen"
                href="/login"
                desc="Signalez, gagnez des points, suivez vos contributions et participez à l'écologie urbaine."
                gradient="bg-gradient-to-br from-emerald-600 to-teal-500"
                icon={Users}
                features={[
                  "Signalement photo en 4 étapes",
                  "Analyse IA instantanée",
                  "Points & badges de récompense",
                  "Suivi en temps réel",
                ]}
                delay={0}
              />
              <RoleCard
                role="ADMIN"
                label="Administrateur"
                href="/login"
                desc="Supervisez l'ensemble des opérations, gérez les agents et visualisez les analytics de la ville."
                gradient="bg-gradient-to-br from-blue-600 to-indigo-600"
                icon={BarChart3}
                features={[
                  "Mission Control centralisé",
                  "Gestion agents & véhicules",
                  "Analytiques avancées",
                  "Recommandations IA",
                ]}
                delay={0.1}
              />
              <RoleCard
                role="AGENT"
                label="Agent de Collecte"
                href="/login"
                desc="Accédez à votre tournée optimisée, enregistrez vos interventions et suivez vos performances."
                gradient="bg-gradient-to-br from-violet-600 to-purple-700"
                icon={Truck}
                features={[
                  "Tournée GPS optimisée",
                  "Carte interactive",
                  "Validation photo",
                  "Score de performance",
                ]}
                delay={0.2}
              />
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section
          id="comment"
          className="py-32 px-6 md:px-10 relative overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#080F0A] via-[#0D1F12] to-[#080F0A]" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Left: steps */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="mb-14"
                >
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3 block">
                    Le processus
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                    De la rue à la solution <br />
                    en moins de 48h
                  </h2>
                </motion.div>

                <div className="space-y-10">
                  <StepCard
                    n="01"
                    title="Signalement citoyen"
                    desc="Un citoyen photographie un dépôt sauvage. L'app détecte automatiquement la position GPS et prépare l'analyse."
                    icon={MapPin}
                    color="bg-emerald-600"
                  />
                  <StepCard
                    n="02"
                    title="Analyse par l'IA"
                    desc="Notre modèle identifie le type de déchets, évalue le volume, calcule la priorité d'intervention et attribue un score de confiance."
                    icon={BrainCircuit}
                    color="bg-blue-600"
                  />
                  <StepCard
                    n="03"
                    title="Mission assignée"
                    desc="L'administrateur valide et assigne l'intervention à l'agent disponible le plus proche avec le véhicule adapté."
                    icon={Truck}
                    color="bg-violet-600"
                  />
                  <StepCard
                    n="04"
                    title="Résolution & récompense"
                    desc="L'agent collecte, prend la photo de confirmation. Le citoyen reçoit ses points et la ville reste propre."
                    icon={Star}
                    color="bg-amber-500"
                  />
                </div>
              </div>

              {/* Right: visual */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="hidden lg:block"
              >
                <div className="relative">
                  {/* Floating AI card */}
                  <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
                    {/* Fake app UI mockup */}
                    <div className="h-12 border-b border-white/10 flex items-center px-5 gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                      <div className="ml-4 h-6 w-48 rounded-full bg-white/8" />
                    </div>

                    <div className="p-6 space-y-5">
                      {/* AI scan result */}
                      <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-violet-600/10 border border-blue-500/20 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <BrainCircuit className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400 font-bold text-sm">
                            Analyse IA complète
                          </span>
                          <span className="ml-auto text-xs text-white/40">
                            0.8s
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            {
                              label: "Type détecté",
                              value: "Plastique",
                              color: "text-blue-300",
                            },
                            {
                              label: "Confiance",
                              value: "94%",
                              color: "text-green-400",
                            },
                            {
                              label: "Volume estimé",
                              value: "Moyen",
                              color: "text-amber-300",
                            },
                            {
                              label: "Priorité",
                              value: "Haute",
                              color: "text-orange-400",
                            },
                          ].map((item, i) => (
                            <div key={i} className="bg-white/5 rounded-xl p-3">
                              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
                                {item.label}
                              </p>
                              <p className={`font-black text-sm ${item.color}`}>
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Progress steps */}
                      <div className="space-y-3">
                        {[
                          { label: "Photo reçue", done: true },
                          { label: "Analyse IA", done: true },
                          { label: "Agent assigné", done: true },
                          {
                            label: "Collecte en cours",
                            done: false,
                            active: true,
                          },
                        ].map((s, i) => (
                          <div key={i} className="flex items-center gap-3">
                            {s.done ? (
                              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                            ) : s.active ? (
                              <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                              </div>
                            ) : (
                              <Circle className="w-5 h-5 text-white/20 shrink-0" />
                            )}
                            <span
                              className={`text-sm ${s.done ? "text-white/70 line-through" : s.active ? "text-white font-semibold" : "text-white/30"}`}
                            >
                              {s.label}
                            </span>
                            {s.active && (
                              <span className="ml-auto text-[10px] font-bold text-blue-400 animate-pulse">
                                EN COURS
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Citizen reward preview */}
                      <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-emerald-500/10 border border-primary/20 p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/30 flex items-center justify-center">
                          <Star className="w-5 h-5 text-primary fill-primary" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-bold">
                            +50 points gagnés !
                          </p>
                          <p className="text-white/50 text-xs">
                            Signalement validé · Niveau 3 → 4
                          </p>
                        </div>
                        <div className="ml-auto text-2xl font-black text-primary">
                          🎉
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating badge */}
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute -top-6 -right-6 bg-primary rounded-2xl px-4 py-3 shadow-xl shadow-primary/30"
                  >
                    <p className="text-white font-black text-lg">87%</p>
                    <p className="text-white/70 text-xs font-medium">
                      validé par IA
                    </p>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute -bottom-6 -left-6 bg-[#0D1F12] border border-white/10 rounded-2xl px-4 py-3 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-white font-black text-base">48h</p>
                        <p className="text-white/40 text-xs">temps moyen</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── IMPACT ── */}
        <section
          id="impact"
          className="py-32 px-6 md:px-10 bg-[#080F0A] relative overflow-hidden"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <span className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-3 block">
                Impact réel
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white">
                Douala plus propre, chaque jour
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/8 rounded-3xl overflow-hidden">
              {[
                {
                  n: 12450,
                  s: "+",
                  label: "Signalements",
                  sub: "depuis le lancement",
                  color: "text-emerald-400",
                },
                {
                  n: 87,
                  s: "%",
                  label: "IA Accuracy",
                  sub: "taux de validation",
                  color: "text-blue-400",
                },
                {
                  n: 93,
                  s: "%",
                  label: "Succès",
                  sub: "missions complétées",
                  color: "text-violet-400",
                },
                {
                  n: 420,
                  s: "",
                  label: "Citoyens",
                  sub: "actifs cette semaine",
                  color: "text-amber-400",
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-[#080F0A] px-8 py-12 text-center"
                >
                  <p
                    className={`text-5xl md:text-6xl font-black mb-2 ${s.color}`}
                  >
                    <Counter to={s.n} suffix={s.s} />
                  </p>
                  <p className="text-white font-bold text-lg mb-1">{s.label}</p>
                  <p className="text-white/30 text-sm">{s.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Feature pills */}
            <div className="mt-16 flex flex-wrap justify-center gap-3">
              {[
                { icon: ShieldCheck, text: "Données chiffrées & sécurisées" },
                { icon: Zap, text: "Analyse IA en < 1 seconde" },
                { icon: MapPin, text: "Couverture Douala Métropole" },
                { icon: BarChart3, text: "Analytics en temps réel" },
                { icon: Users, text: "Participation citoyenne" },
              ].map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm text-white/70 font-medium"
                >
                  <p.icon className="w-4 h-4 text-primary" />
                  {p.text}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ── */}
        <section className="py-24 px-6 md:px-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-500 to-blue-600" />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14">
                <div>
                  <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                    Prêt à agir pour votre ville ?
                  </h2>
                  <p className="text-white/80 text-lg">
                    Rejoignez les 420+ citoyens qui contribuent chaque jour à
                    Douala.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Link href="/register">
                    <Button
                      size="lg"
                      className="rounded-full h-14 px-8 bg-white text-primary hover:bg-white/90 font-bold shadow-xl text-base"
                    >
                      Créer un compte gratuit
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="ghost"
                      className="rounded-full h-14 px-8 text-white border border-white/30 hover:bg-white/10 text-base"
                    >
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-14 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="font-black text-xl">
                  EcoKamer<span className="text-primary">.ai</span>
                </span>
              </div>
              <p className="text-white/40 text-sm max-w-xs leading-relaxed">
                Plateforme SaaS de gestion intelligente des déchets urbains.
                Prototype de démonstration.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 text-sm">
              <div>
                <p className="text-white/30 font-bold uppercase tracking-wider text-xs mb-4">
                  Compte
                </p>
                <div className="space-y-2.5">
                  <Link
                    href="/login"
                    className="block text-white/60 hover:text-white transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="block text-white/60 hover:text-white transition-colors"
                  >
                    Inscription
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-white/30 font-bold uppercase tracking-wider text-xs mb-4">
                  Projet
                </p>
                <div className="space-y-2.5">
                  <span className="block text-white/60">Douala, Cameroun</span>
                  <span className="block text-white/60">v1.0</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-white/25">
            <span>© 2026 EcoCollect AI. Tous droits réservés.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

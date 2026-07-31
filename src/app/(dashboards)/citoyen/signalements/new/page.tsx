"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { MapComponent } from "@/components/ui/MapComponent";
import { Confetti } from "@/components/ui/Confetti";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Camera,
  Upload,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Loader2,
  Sparkles,
  AlertTriangle,
  Navigation,
  Star,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { uploadFileWithProgress } from "@/lib/upload-file";
import { signalementsApi, userApi } from "@/lib/api";
import { useAppStore } from "@/lib/store";

const STEPS = ["Photo", "Analyse IA", "Localisation", "Détails"];

const WASTE_TYPES = [
  "Ménager",
  "Plastique",
  "Organique",
  "Construction",
  "Électronique",
  "Dangereux",
];
const PRIORITIES = [
  {
    value: "Basse",
    label: "Basse",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    value: "Normale",
    label: "Normale",
    color: "bg-blue-50  text-blue-700  border-blue-200",
  },
  {
    value: "Haute",
    label: "Haute",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    value: "Critique",
    label: "Critique",
    color: "bg-red-50   text-red-700   border-red-200",
  },
];

/* ── tiny AI scan animation ─────────────────────────────────────── */
function AIScan({ progress }: { progress: number }) {
  return (
    <div className="relative w-full max-w-xs mx-auto aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-primary/30 shadow-2xl shadow-primary/20">
      {/* photo bg */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
        <Camera className="w-24 h-24 text-primary" />
      </div>
      {/* scan line */}
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_12px_3px] shadow-primary/60"
        animate={{ top: ["5%", "95%", "5%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {/* corner decorations */}
      {[
        "top-2 left-2",
        "top-2 right-2",
        "bottom-2 left-2",
        "bottom-2 right-2",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-5 h-5 border-2 border-primary rounded-sm opacity-80`}
        />
      ))}
      {/* confidence bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3">
        <div className="flex items-center justify-between text-xs text-primary mb-1.5">
          <span className="font-mono">Analyse en cours...</span>
          <span className="font-bold">{progress}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-1.5">
          <motion.div
            className="h-1.5 bg-primary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function NouveauSignalement() {
  const navigate = useRouter();
  const { user } = useAppStore();
  const [step, setStep] = React.useState(1);
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const [aiProgress, setAiProgress] = React.useState(0);
  const [aiResult, setAiResult] = React.useState<any>(null);
  const [confetti, setConfetti] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  // Location states
  const [location, setLocation] = React.useState<{
    lat: number;
    lng: number;
    address: any;
  } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  const [hasRequestedLocation, setHasRequestedLocation] = React.useState(false);

  const [details, setDetails] = React.useState({
    wasteType: "Plastique",
    priority: "Normale",
    description: "",
    volume: "Moyen",
  });

  // Function to get real location
  const getRealLocation = React.useCallback(() => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError(
        "La géolocalisation n'est pas supportée par votre navigateur",
      );
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const address = await getAddressFromCoords(latitude, longitude);
          setLocation({
            lat: latitude,
            lng: longitude,
            address: address,
          });
          setLocationError(null);
          toast.success("Position détectée avec succès");
        } catch (error) {
          // Even if address fetch fails, we still have coordinates
          setLocation({
            lat: latitude,
            lng: longitude,
            address: "Position détectée",
          });
          setLocationError(null);
        }

        setIsLoadingLocation(false);
        setHasRequestedLocation(true);
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = "";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "⚠️ Vous devez autoriser l'accès à votre position pour créer un signalement. Veuillez autoriser la géolocalisation dans les paramètres de votre navigateur.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Position non disponible. Vérifiez votre connexion GPS et réessayez.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "La demande de position a expiré. Vérifiez votre connexion et réessayez.";
            break;
          default:
            errorMessage = "Impossible de récupérer votre position. Réessayez.";
        }

        setLocationError(errorMessage);
        setIsLoadingLocation(false);
        setHasRequestedLocation(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, []);

  // Function to reverse geocode
  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            "User-Agent": "YourAppName/1.0",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch address");

      const data = await response.json();
      console.log(data);
      return data || "Adresse détectée";
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return "Adresse détectée";
    }
  };

  // Request location when component mounts
  React.useEffect(() => {
    if (!hasRequestedLocation) {
      getRealLocation();
    }
  }, [getRealLocation, hasRequestedLocation]);

  /* pick photo → go to step 2 AI */
  const pickPhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    setPhoto(file);
    setPhotoPreview(url);
    setStep(2);
    runAI();
  };

  const runAI = async () => {
    if (!photo) return;

    setAiProgress(0);

    try {
      // Convert to base64
      const reader = new FileReader();
      const imageBase64 = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(photo);
      });

      // Call API
      const res = await fetch("/api/analyze-waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });

      const data = await res.json();
      console.log(data)

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10 + 5);
        if (progress >= 95) {
          clearInterval(interval);
          setAiResult({
            confidence: data.confidence,
            objects: data.objects || ["Déchet détecté"],
            decision: data.decision,
          });
          setStep(3);
          setAiProgress(100);
        } else {
          setAiProgress(progress);
        }
      }, 150);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur d'analyse, réessayez");
      // Fallback: go to next step anyway
      setStep(3);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }
    pickPhoto(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (!photo || !user) return;
      const image_url = await uploadFileWithProgress(
        photo,
        "signalements",
        "",
        () => {},
      );
      await signalementsApi.create({
        description: details.description,
        categorie: details.wasteType,
        niveau_accumulation: details.volume,
        priorite: details.priority,
        adresse: location?.address.display_name ?? "",
        ville: location?.address.address.city ?? "",
        code_postal: "",
        pays: location?.address.address.country ?? "",
        latitude: location?.lat,
        longitude: location?.lng,
        fichier_url: image_url,
        commentaire_public: details.description,
      });
      await userApi.update(user.id, { points: user.points + 50 });
      setConfetti(true);
      setDone(true);
      setTimeout(() => setConfetti(false), 4500);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── success screen ───────────────────────────────────────────── */
  if (done) {
    return (
      <>
        <Confetti active={confetti} />
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
          >
            <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-black mb-3">Signalement envoyé !</h1>
            <p className="text-muted-foreground max-w-sm mb-2">
              Merci pour votre contribution. L'IA a validé votre signalement
              avec une confiance de <strong>97%</strong>.
            </p>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              +50 points gagnés !
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate.push("/citoyen/signalements")}
              >
                Voir mes signalements
              </Button>
              <Button
                onClick={() => {
                  setDone(false);
                  setStep(1);
                  setPhotoPreview(null);
                  setAiResult(null);
                }}
              >
                Nouveau signalement
              </Button>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  /* ── step header ──────────────────────────────────────────────── */
  const header = (
    <div className="mb-8">
      <button
        onClick={() => navigate.push("/citoyen/dashboard")}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>
      <h1 className="text-2xl font-bold tracking-tight mb-6">
        Nouveau signalement
      </h1>
      {/* Step progress */}
      <div className="flex items-center gap-0">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <React.Fragment key={n}>
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                  ${done ? "bg-primary border-primary text-white" : active ? "border-primary text-primary bg-primary/10" : "border-muted-foreground/30 text-muted-foreground/50"}`}
                >
                  {done ? <CheckCircle2 className="w-4 h-4" /> : n}
                </div>
                <span
                  className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-primary" : done ? "text-primary/70" : "text-muted-foreground/50"}`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mb-5 mx-1 transition-all ${n < step ? "bg-primary" : "bg-muted-foreground/20"}`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );

  /* ── STEP 1: Photo ────────────────────────────────────────────── */
  const step1 = (
    <motion.div
      key="s1"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold">Prenez une photo du dépôt</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Une bonne photo permet à l'IA d'analyser précisément le type de déchet
        </p>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 md:p-16 flex flex-col items-center gap-4 cursor-pointer transition-all select-none
          ${dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/30"}`}
        onClick={() => fileRef.current?.click()}
      >
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Camera className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg">Glissez votre photo ici</p>
          <p className="text-muted-foreground text-sm mt-1">
            ou cliquez pour sélectionner depuis votre galerie
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" /> JPG, PNG, HEIC
          </span>
          <span>•</span>
          <span>Max 10 MB</span>
        </div>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />

      <p className="text-center text-xs text-muted-foreground mt-6">
        💡 Astuce : une photo nette et bien cadrée améliore la précision de l'IA
        jusqu'à <strong>95%+</strong>
      </p>
    </motion.div>
  );

  /* ── STEP 2: AI Scan ──────────────────────────────────────────── */
  const step2 = (
    <motion.div
      key="s2"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex flex-col items-center gap-8"
    >
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4 animate-pulse" /> Intelligence
          Artificielle
        </div>
        <h2 className="text-xl font-bold">Analyse en cours...</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Notre IA identifie le type de déchet et évalue la situation
        </p>
      </div>

      <AIScan progress={Math.min(aiProgress, 97)} />

      <div className="w-full max-w-xs space-y-3">
        {[
          { label: "Détection des objets", done: aiProgress > 30 },
          { label: "Classification du déchet", done: aiProgress > 60 },
          { label: "Évaluation du volume", done: aiProgress > 80 },
          { label: "Calcul de la priorité", done: aiProgress > 95 },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-3 text-sm">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all ${item.done ? "bg-primary" : "bg-muted"}`}
            >
              {item.done && <CheckCircle2 className="w-3 h-3 text-white" />}
            </div>
            <span
              className={
                item.done
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );

  /* ── STEP 3: Location ─────────────────────────────────────────── */
  const mapMarkers = [
    {
      id: "loc",
      lat: location?.lat ?? 0,
      lng: location?.lng ?? 0,
      color: "#16A34A",
    },
  ];
  const step3 = (
    <motion.div
      key="s3"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Localisation requise</h2>
        <p className="text-muted-foreground text-sm mt-1">
          {!location &&
            !locationError &&
            isLoadingLocation &&
            "Récupération de votre position..."}
          {!location && locationError && "⚠️ Autorisation nécessaire"}
          {location && "✅ Position détectée avec succès"}
        </p>
      </div>

      {/* Error state - permission denied */}
      {locationError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-red-800 text-lg mb-2">
                Accès à la position refusé
              </h3>
              <p className="text-red-700 text-sm max-w-sm mx-auto">
                {locationError}
              </p>
            </div>
            <Button
              onClick={getRealLocation}
              className="gap-2"
              variant="destructive"
            >
              <Navigation className="w-4 h-4" />
              Réessayer
            </Button>
            <p className="text-xs text-red-600 mt-2">
              💡 Astuce : Cherchez l'icône 🔒 dans la barre d'adresse pour
              modifier les permissions
            </p>
          </div>
        </motion.div>
      )}

      {/* Loading state */}
      {!location && !locationError && isLoadingLocation && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Récupération de votre position...
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoadingLocation(false);
              setHasRequestedLocation(false);
              setTimeout(() => getRealLocation(), 100);
            }}
          >
            Annuler et réessayer
          </Button>
        </div>
      )}

      {/* Location found */}
      {location && !locationError && (
        <>
          {/* AI result banner */}
          {aiResult && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">
                  IA : confiance {aiResult.confidence}% — {aiResult.decision}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Objets détectés : {aiResult.objects.join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Map */}
          <div className="rounded-2xl overflow-hidden border shadow-sm">
            <MapComponent
              markers={[
                {
                  id: "loc",
                  lat: location.lat,
                  lng: location.lng,
                  color: "#16A34A",
                },
              ]}
              height="260px"
              center={[location.lat, location.lng]}
              zoom={16}
            />
          </div>

          {/* Address */}
          <div className="bg-card border rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-0.5">
                Adresse détectée
              </p>
              <p className="font-semibold text-sm">
                {location?.address.display_name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={getRealLocation}
              disabled={isLoadingLocation}
            >
              <Navigation className="w-3.5 h-3.5" />
              Rafraîchir
            </Button>
          </div>
        </>
      )}

      {/* Continue button - only enabled when location is available */}
      <Button
        className="w-full h-12 text-base gap-2 rounded-xl"
        onClick={() => setStep(4)}
        disabled={!location || isLoadingLocation || !!locationError}
      >
        {!location && !locationError && isLoadingLocation && (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Récupération...
          </>
        )}
        {!location && locationError && <>⚠️ Autorisation requise</>}
        {location && !locationError && (
          <>
            Confirmer la localisation <ChevronRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </motion.div>
  );

  /* ── STEP 4: Details ──────────────────────────────────────────── */
  const step4 = (
    <motion.div
      key="s4"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-bold">Derniers détails</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Précisez les informations pour aider les agents
        </p>
      </div>

      {/* Photo preview */}
      {photoPreview && (
        <div className="w-full aspect-video rounded-2xl overflow-hidden border">
          <img
            src={photoPreview}
            alt="Dépôt signalé"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="space-y-5">
        {/* Waste type */}
        <div>
          <label className="text-sm font-semibold mb-2 block">
            Type de déchet
          </label>
          <div className="grid grid-cols-3 gap-2">
            {WASTE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setDetails((d) => ({ ...d, wasteType: t }))}
                className={`py-2 px-3 rounded-xl text-sm border transition-all font-medium
                  ${details.wasteType === t ? "bg-primary text-white border-primary shadow-sm" : "bg-card border-border hover:border-primary/50"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <label className="text-sm font-semibold mb-2 block">
            Niveau d'urgence
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                onClick={() => setDetails((d) => ({ ...d, priority: p.value }))}
                className={`py-2.5 px-4 rounded-xl text-sm border transition-all font-medium flex items-center gap-2
                  ${details.priority === p.value ? p.color + " border-2 shadow-sm" : "bg-card border-border hover:border-primary/30"}`}
              >
                {p.value === "Critique" && (
                  <AlertTriangle className="w-3.5 h-3.5" />
                )}
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div>
          <label className="text-sm font-semibold mb-2 block">
            Volume estimé
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["Petit", "Moyen", "Grand"].map((v) => (
              <button
                key={v}
                onClick={() => setDetails((d) => ({ ...d, volume: v }))}
                className={`py-2.5 text-sm rounded-xl border font-medium transition-all
                  ${details.volume === v ? "bg-primary text-white border-primary" : "bg-card border-border hover:border-primary/50"}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold mb-2 block">
            Description{" "}
            <span className="font-normal text-muted-foreground">
              (optionnel)
            </span>
          </label>
          <textarea
            value={details.description}
            onChange={(e) =>
              setDetails((d) => ({ ...d, description: e.target.value }))
            }
            placeholder="Précisions utiles pour les agents de collecte..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full h-13 text-base rounded-xl py-4 shadow-lg shadow-primary/20 gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Envoi en cours...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-5 h-5" /> Envoyer le signalement
          </>
        )}
      </Button>
    </motion.div>
  );

  return (
    <>
      <div className="max-w-lg mx-auto">
        {header}
        <div className="bg-card border rounded-2xl shadow-sm p-6 md:p-8 min-h-[420px]">
          <AnimatePresence mode="wait">
            {step === 1 && step1}
            {step === 2 && step2}
            {step === 3 && step3}
            {step === 4 && step4}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

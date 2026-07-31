"use client";
import * as React from "react";
import { mockVehicles } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Truck,
  Fuel,
  Wrench,
  Plus,
  X,
  Loader2,
  Filter,
  ChevronDown,
  MapPin,
  Calendar,
  Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Vehicule } from "@/lib/types";
import { vehiculesApi } from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Vehicules() {
  const [vehicles, setVehicles] = React.useState<Vehicule[]>([]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("Tous");
  const [showModal, setShowModal] = React.useState(false);

  React.useEffect(() => {
    async function getVehicules() {
      const { data } = await vehiculesApi.getAll();
      setVehicles(data ?? []);
    }
    getVehicules();
  }, []);

  const [saving, setSaving] = React.useState(false);

  const [form, setForm] = React.useState({
    immatriculation: "",
    type: "Camion Benne",
    capacite: "",
    niveau_carburant: "100",
    status: "Disponible",
  });
  const [formErrors, setFormErrors] = React.useState<Partial<typeof form>>({});

  const filtered = vehicles.filter((v) => {
    if (statusFilter !== "Tous" && v.statut !== statusFilter) return false;
    if (
      search &&
      !v.immatriculation.toLowerCase().includes(search.toLowerCase()) &&
      !v.type.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setFormErrors((p) => ({ ...p, [field]: undefined }));
    };

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.immatriculation.trim()) e.immatriculation = "Requis";
    else if (
      !/^[A-Z]{2}-\d{3}-[A-Z]{2}$/.test(form.immatriculation.toUpperCase())
    )
      e.immatriculation = "Format: AB-123-CD";
    if (!form.capacite.trim()) e.capacite = "Requis";
    const fuel = parseInt(form.niveau_carburant);
    if (isNaN(fuel) || fuel < 0 || fuel > 100)
      e.niveau_carburant = "Entre 0 et 100";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const newVehicle: Partial<Vehicule> = {
        immatriculation: form.immatriculation.toUpperCase(),
        type: form.type,
        capacite: form.capacite.includes("m")
          ? form.capacite
          : `${form.capacite}m³`,
        niveau_carburant: parseInt(form.niveau_carburant),
        statut: form.status as any,
        statut_maintenance: "a_jour",
        date_derniere_maintenance: new Date().toISOString().split("T")[0],
      };
      await vehiculesApi.create(newVehicle as any);
      setShowModal(false);
      setForm({
        immatriculation: "",
        type: "Camion Benne",
        capacite: "",
        niveau_carburant: "100",
        status: "disponible",
      });
      toast.success(`Véhicule ${newVehicle.immatriculation} ajouté à la flotte`);
    } catch (error: any) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  const statusColor = (status: string) =>
    status === "disponible"
      ? "bg-green-500"
      : status === "en_service"
      ? "bg-blue-500"
      : "bg-destructive";

  const statusText = (status: string) =>
    status === "disponible"
      ? "text-green-600"
      : status === "en_service"
      ? "text-blue-600"
      : "text-destructive";

  const statusLabel = (status: string) =>
    status === "disponible"
      ? "Disponible"
      : status === "en_service"
      ? "En service"
      : "En maintenance";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Flotte de Véhicules
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {filtered.length} véhicule{filtered.length > 1 ? "s" : ""} dans la flotte
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-card border px-3 sm:px-4 py-2 rounded-lg shadow-sm flex-1 sm:flex-none justify-center">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="font-semibold text-lg">{vehicles.length}</span>
              <span className="text-muted-foreground text-xs sm:text-sm">Véhicules</span>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="gap-2 rounded-lg flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="w-4 h-4" /> 
              <span className="hidden sm:inline">Nouveau véhicule</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Rechercher par immatriculation ou type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Filter buttons - Desktop */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {["Tous", "Disponible", "En service", "En maintenance"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

        </div>

        {/* Mobile filter chips */}
        <div className="flex md:hidden gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {["Tous", "Disponible", "En service", "En maintenance"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-2.5 py-1 text-[10px] font-medium rounded-full whitespace-nowrap transition-colors ${
                statusFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {filtered.map((vehicle) => (
          <Card
            key={vehicle.id}
            className="overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className={`h-2 w-full ${statusColor(vehicle.statut)}`} />
            <CardContent className="p-4 sm:p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-base sm:text-lg truncate">
                    {vehicle.immatriculation}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">
                    {vehicle.type}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-muted shrink-0 ml-2">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 text-sm mt-4 sm:mt-6">
                {/* Fuel */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-xs sm:text-sm">
                      <Fuel className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Carburant
                    </span>
                    <span className="font-medium text-xs sm:text-sm">
                      {vehicle.niveau_carburant}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        vehicle.niveau_carburant > 50
                          ? "bg-green-500"
                          : vehicle.niveau_carburant > 20
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${vehicle.niveau_carburant}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground text-xs">Capacité</span>
                    <span className="font-semibold text-sm">{vehicle.capacite}</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="text-muted-foreground text-xs">Statut</span>
                    <span
                      className={`font-medium text-xs sm:text-sm ${statusText(
                        vehicle.statut
                      )}`}
                    >
                      {statusLabel(vehicle.statut)}
                    </span>
                  </div>
                </div>

                {/* Maintenance */}
                <div className="bg-muted/50 p-3 rounded-lg border mt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Wrench className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-medium text-[10px] uppercase">
                      Maintenance
                    </span>
                  </div>
                  <p
                    className={`text-[10px] sm:text-xs ${
                      vehicle.statut_maintenance === "a_jour"
                        ? "text-green-600"
                        : "text-amber-600"
                    }`}
                  >
                    {vehicle.statut_maintenance === "a_jour" ? "✅ À jour" : "⚠️ À prévoir"} 
                    <span className="text-muted-foreground">
                      {" "}({new Date(
                        vehicle.date_derniere_maintenance!
                      ).toLocaleDateString("fr-FR")})
                    </span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Aucun véhicule trouvé
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Essayez de modifier vos filtres ou ajoutez un nouveau véhicule
          </p>
        </div>
      )}

      {/* Add Vehicle Modal - Responsive */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold">
                      Nouveau véhicule
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Ajouter un véhicule à la flotte
                    </p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAdd} className="p-4 sm:p-6 space-y-4">
                  <Field
                    label="Immatriculation"
                    error={formErrors.immatriculation}
                  >
                    <input
                      type="text"
                      value={form.immatriculation}
                      onChange={set("immatriculation")}
                      placeholder="AB-123-CD"
                      className={fieldClass(!!formErrors.immatriculation)}
                    />
                  </Field>

                  <Field label="Type de véhicule">
                    <select
                      value={form.type}
                      onChange={set("type")}
                      className={fieldClass(false)}
                    >
                      <option>Camion Benne</option>
                      <option>Fourgonnette</option>
                      <option>Camion Grue</option>
                      <option>Utilitaire Léger</option>
                      <option>Camion Compacteur</option>
                    </select>
                  </Field>

                  <Field label="Capacité (m³)" error={formErrors.capacite}>
                    <input
                      type="text"
                      value={form.capacite}
                      onChange={set("capacite")}
                      placeholder="ex: 12"
                      className={fieldClass(!!formErrors.capacite)}
                    />
                  </Field>

                  <Field
                    label="Niveau de carburant (%)"
                    error={formErrors.niveau_carburant}
                  >
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={form.niveau_carburant}
                      onChange={set("niveau_carburant")}
                      className={fieldClass(!!formErrors.niveau_carburant)}
                    />
                  </Field>

                  <Field label="Statut">
                    <select
                      value={form.status}
                      onChange={set("status")}
                      className={fieldClass(false)}
                    >
                      <option value="disponible">Disponible</option>
                      <option value="en_maintenance">En maintenance</option>
                    </select>
                  </Field>

                  <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={closeModal}
                    >
                      Annuler
                    </Button>
                    <Button type="submit" className="w-full" disabled={saving}>
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Ajouter le véhicule"
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return `w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${
    hasError ? "border-destructive" : "border-input"
  }`;
}
"use client";
import * as React from "react";
import { mockAgents } from "@/lib/mockData";
import { AgentCard } from "@/components/ui/AgentCard";
import { Input } from "@/components/ui/input";
import { Search, Filter, Users, Plus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Agent } from "@/lib/types";
import { agentsApi } from "@/lib/api";

export default function Agents() {
  const [agents, setAgents] = React.useState<Agent[]>([]);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("Tous");
  const [showModal, setShowModal] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    async function getAgents() {
      const { data } = await agentsApi.getAll();
      setAgents(data ?? []);
    }
    getAgents();
  }, []);

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "disponible",
    matricule: "",
    organizationId: "Douala-1",
  });
  const [formErrors, setFormErrors] = React.useState<Partial<typeof form>>({});

  const filteredAgents = agents.filter((a) => {
    if (statusFilter !== "Tous" && a.statut !== statusFilter) return false;
    if (search && !a.nom_complet.toLowerCase().includes(search.toLowerCase()))
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
    if (!form.firstName.trim()) e.firstName = "Requis";
    if (!form.lastName.trim()) e.lastName = "Requis";
    if (!form.email) e.email = "Requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "E-mail invalide";
    if (!form.phone.trim()) e.phone = "Requis";
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const newAgent: Partial<Agent> = {
        nom_complet: `${form.firstName} ${form.lastName}`,
        email: form.email,
        matricule: form.matricule,
        phone: form.phone,
        statut: form.status as any,
        zone_intervention: form.organizationId,
      };
      await agentsApi.create(newAgent);
      setShowModal(false);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        matricule: "",
        status: "disponible",
        organizationId: "Douala-1",
      });
      toast.success(`Agent ${newAgent.nom_complet} ajouté avec succès`);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setSaving(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Agents de Collecte
            </h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              {filteredAgents.length} agent
              {filteredAgents.length > 1 ? "s" : ""} dans l'équipe
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 bg-card border px-3 sm:px-4 py-2 rounded-lg shadow-sm flex-1 sm:flex-none justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="font-semibold text-lg">{agents.length}</span>
              <span className="text-muted-foreground text-xs sm:text-sm">
                Agents
              </span>
            </div>
            <Button
              onClick={() => setShowModal(true)}
              className="gap-2 rounded-lg flex-1 sm:flex-none"
              size="sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvel agent</span>
              <span className="sm:hidden">Ajouter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-card border rounded-xl p-3 sm:p-4 mb-6 sm:mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un agent..."
              className="pl-9 bg-background w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter buttons - Tous les écrans */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground shrink-0">
              <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Statut</span>
            </div>
            {["Tous", "Disponible", "En mission", "Indisponible"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-lg font-medium text-muted-foreground">
            Aucun agent trouvé
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Essayez de modifier vos filtres ou ajoutez un nouvel agent
          </p>
        </div>
      )}

      {/* Add Agent Modal */}
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
                      Nouvel agent
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      Ajouter un agent de collecte à l'équipe
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Prénom" error={formErrors.firstName}>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={set("firstName")}
                        placeholder="Jean"
                        className={fieldClass(!!formErrors.firstName)}
                      />
                    </Field>
                    <Field label="Nom" error={formErrors.lastName}>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={set("lastName")}
                        placeholder="Dupont"
                        className={fieldClass(!!formErrors.lastName)}
                      />
                    </Field>
                  </div>

                  <Field label="matricule" error={formErrors.matricule}>
                    <input
                      type="text"
                      value={form.matricule}
                      onChange={set("matricule")}
                      placeholder="MAT-432"
                      className={fieldClass(!!formErrors.matricule)}
                    />
                  </Field>

                  <Field label="E-mail professionnel" error={formErrors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="j.dupont@ecocollect.fr"
                      className={fieldClass(!!formErrors.email)}
                    />
                  </Field>

                  <Field label="Téléphone" error={formErrors.phone}>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="06 12 34 56 78"
                      className={fieldClass(!!formErrors.phone)}
                    />
                  </Field>

                  <Field label="Statut initial">
                    <select
                      value={form.status}
                      onChange={set("status")}
                      className={fieldClass(false)}
                    >
                      <option value="disponible">Disponible</option>
                      <option value="hors_service">Indisponible</option>
                    </select>
                  </Field>

                  <Field label="Organisation">
                    <select
                      value={form.organizationId}
                      onChange={set("organizationId")}
                      className={fieldClass(false)}
                    >
                      <option value="Douala-1">EcoKamer Douala I</option>
                      <option value="Douala-2">EcoKamer Douala II</option>
                      <option value="Douala-3">EcoKamer Douala III</option>
                      <option value="Douala-4">EcoKamer Douala IV</option>
                      <option value="Douala-5">EcoKamer Douala V</option>
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
                        "Ajouter l'agent"
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
  return `w-full px-3 py-2.5 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${hasError ? "border-destructive" : "border-input"}`;
}

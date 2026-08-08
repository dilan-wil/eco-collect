import { supabase } from "./supabaseClient";
import { Agent, MissionStatut, Signalement, User, Vehicule } from "./types";

/* ================= USERS ================= */

export const userApi = {
  create: async (payload: {
    email: string;
    nom_complet: string;
    phone?: string;
    role: string;
  }) => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .insert(payload)
      .select()
      .single();

    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  update: async (id: string, updates: Partial<User>) => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },
};

/* ================= SIGNALEMENTS ================= */

export const signalementsApi = {
  create: async (payload: {
    description: string;
    categorie: string;
    niveau_accumulation: string;
    priorite?: string;
    adresse?: string;
    ville?: string;
    code_postal?: string;
    pays?: string;
    latitude?: number;
    longitude?: number;
    fichier_url?: string;
    categorie_id?: string;
    commentaire_public?: string;
    confiance_ia: number;
    objets_ia: string[];
  }) => {
    const { data, error } = await supabase
      .from("signalements")
      .insert(payload)
      .select()
      .single();

    return { data, error };
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("signalements")
      .select("*")
      .order("date_creation", { ascending: false });

    return { data, error };
  },

  getMine: async () => {
    const { data, error } = await supabase
      .from("signalements")
      .select("*")
      .order("date_creation", { ascending: false });

    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("signalements")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  getByStatus: async (statut: string) => {
    const { data, error } = await supabase
      .from("signalements")
      .select("*")
      .eq("statut", statut)
      .order("date_creation", { ascending: false });

    return { data, error };
  },

  getAssignedTo: async (agentId: string) => {
    const { data, error } = await supabase
      .from("signalements")
      .select("*")
      .eq("assigne_a", agentId)
      .order("date_creation", { ascending: false });

    return { data, error };
  },

  update: async (id: string, updates: Partial<Signalement>) => {
    const { data, error } = await supabase
      .from("signalements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  assign: async (id: string, agentId: string) => {
    const { data, error } = await supabase
      .from("signalements")
      .update({
        assigne_a: agentId,
        statut: "assigne",
      })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  updateStatus: async (id: string, statut: string) => {
    const { data, error } = await supabase
      .from("signalements")
      .update({
        statut,
      })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("signalements").delete().eq("id", id);

    return { error };
  },
};

export const vehiculesApi = {
  create: async (
    payload: Omit<Vehicule, "id" | "date_creation" | "date_modification">,
  ) => {
    const { data, error } = await supabase
      .from("vehicules")
      .insert(payload)
      .select()
      .single();

    return { data, error };
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("vehicules")
      .select("*")
      .order("date_creation", { ascending: false });

    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("vehicules")
      .select("*")
      .eq("id", id)
      .single();

    return { data, error };
  },

  getDisponible: async () => {
    const { data, error } = await supabase
      .from("vehicules")
      .select("*")
      .eq("statut", "disponible")
      .order("immatriculation");

    return { data, error };
  },

  getByAgent: async (agentId: string) => {
    const { data, error } = await supabase
      .from("vehicules")
      .select("*")
      .eq("id_agent", agentId);

    return { data, error };
  },

  update: async (id: string, updates: Partial<Vehicule>) => {
    const { data, error } = await supabase
      .from("vehicules")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  updateStatut: async (id: string, statut: Vehicule["statut"]) => {
    const { data, error } = await supabase
      .from("vehicules")
      .update({ statut })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  updateCarburant: async (id: string, niveau_carburant: number) => {
    const { data, error } = await supabase
      .from("vehicules")
      .update({ niveau_carburant })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  assignerAgent: async (id: string, id_agent: string | null) => {
    const { data, error } = await supabase
      .from("vehicules")
      .update({ id_agent })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("vehicules").delete().eq("id", id);

    return { error };
  },
};

export const agentsApi = {
  create: async (payload: any) => {
    const response = await fetch("/api/admin/agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return response.json();
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from("agents")
      .select("*")
      .order("date_creation", { ascending: false });

    return { data, error };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from("agents")
      .select(
        `
        *,
        utilisateur:utilisateurs(*),
        vehicule:vehicules(*)
      `,
      )
      .eq("id", id)
      .single();

    return { data, error };
  },

  getDisponibles: async () => {
    const { data, error } = await supabase
      .from("agents")
      .select(
        `
        *,
        utilisateur:utilisateurs(*)
      `,
      )
      .eq("disponibilite", true)
      .eq("statut", "disponible");

    return { data, error };
  },

  assignerVehicule: async (id: string, vehicule_id: string | null) => {
    const { data, error } = await supabase
      .from("agents")
      .update({ vehicule_id })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  update: async (id: string, updates: Partial<Agent>) => {
    const { data, error } = await supabase
      .from("agents")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  delete: async (id: string) => {
    const { error } = await supabase.from("agents").delete().eq("id", id);

    return { error };
  },
};

export const missionsApi = {
  // Créer une mission
  create: async (data: any) => {
    const { data: mission, error } = await supabase
      .from("missions")
      .insert([
        {
          ...data,
          date_creation: new Date().toISOString(),
          date_derniere_mise_a_jour: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return { data: mission };
  },

  // Obtenir toutes les missions
  getAll: async () => {
    const { data, error } = await supabase
      .from("missions")
      .select(
        `
        *,
        signalement:signalement_id (*),
        agent:agent_id (*),
        vehicule:vehicule_id (*)
      `,
      )
      .order("date_creation", { ascending: false });

    if (error) throw error;
    return { data };
  },

  // Obtenir une missions
  getById: async (missionId: string) => {
    const { data, error } = await supabase
      .from("missions")
      .select(
        `
        *,
        signalement:signalement_id (*),
        agent:agent_id (*),
        vehicule:vehicule_id (*)
      `,
      )
      .eq("id", missionId)
      .single()

    if (error) throw error;
    return { data };
  },

  // Obtenir les missions d'un agent
  getByAgent: async (agentId: string) => {
    const { data, error } = await supabase
      .from("missions")
      .select(
        `
        *,
        signalement:signalement_id (*),
        vehicule:vehicule_id (*)
      `,
      )
      .eq("agent_id", agentId)
      .order("date_debut", { ascending: false });

    if (error) throw error;
    return { data };
  },

  // Mettre à jour le statut
  updateStatut: async (
    id: string,
    statut: MissionStatut,
    commentaire?: string,
  ) => {
    const { data, error } = await supabase
      .from("missions")
      .update({
        statut,
        date_derniere_mise_a_jour: new Date().toISOString(),
        ...(statut === "terminee" && {
          date_fin_reelle: new Date().toISOString(),
        }),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Ajouter à l'historique
    await supabase.from("missions_historique").insert([
      {
        mission_id: id,
        nouveau_statut: statut,
        commentaire,
        date_changement: new Date().toISOString(),
      },
    ]);

    return { data };
  },

  // Évaluer une mission
  evaluate: async (id: string, note: number, commentaire: string) => {
    const { data, error } = await supabase
      .from("missions")
      .update({
        note_agent: note,
        commentaire_evaluation: commentaire,
        date_derniere_mise_a_jour: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return { data };
  },

  // Statistiques
  getStats: async () => {
    const { data, error } = await supabase
      .from("missions_stats")
      .select("*")
      .single();

    if (error) throw error;
    return { data };
  },
};

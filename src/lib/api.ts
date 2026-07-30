import { supabase } from "./supabaseClient";
import { Signalement, User } from "./types";

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

  update: async (
    id: string,
    updates: Partial<Signalement>
  ) => {
    const { data, error } = await supabase
      .from("signalements")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  },

  assign: async (
    id: string,
    agentId: string
  ) => {
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

  updateStatus: async (
    id: string,
    statut: string
  ) => {
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
    const { error } = await supabase
      .from("signalements")
      .delete()
      .eq("id", id);

    return { error };
  },
};
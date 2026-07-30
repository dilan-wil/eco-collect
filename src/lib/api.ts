import { supabase } from "./supabaseClient";
import { User } from "./types";

/* ================= USERS ================= */

export const userApi = {
  create: async (payload: {
    email: string;
    full_name: string;
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

/* ================= DONOR ================= */

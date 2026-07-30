"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  sendOtp: async () => {},
  verifyOtp: async () => {},
  signUp: async () => {},
  signIn: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load active session
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    getSession();

    // Listen to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // --- SIGN UP with email and password ---
  const signUp = async (
    email: string,
    password: string,
    metadata: any = {}
  ) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,

      options: {
        data: metadata, // can include role, name, etc.
      },
    });
    setLoading(false);
    if (error) throw error;
    setUser(data.user);
  };

  // --- LOGIN with email and password ---
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) throw error;
    setUser(data.user);
    router.push(`/${(user?.user_metadata?.role).toLowerCase()}`)
  };

  // --- OTP methods ---
  const sendOtp = async (phone: string) => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone,
      options: {
        channel: "whatsapp", // changed to WhatsApp
        data: { role: "client" },
      },
    });
    setLoading(false);
    if (error) throw error;
  };

  const verifyOtp = async (phone: string, token: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms", // must match channel used
    });
    setLoading(false);
    if (error) throw error;
    setUser(data.user);
  };

  // --- LOGOUT ---
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, sendOtp, verifyOtp, signUp, signIn, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
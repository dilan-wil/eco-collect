"use client";

import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/contexts/protected-route";
import { signalementsApi, userApi } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth();
  const { setUser, setSignalements } = useAppStore();

  useEffect(() => {
    async function getUser() {
      if (!user) return;
      const { data } = await userApi.getById(user.id);
      setUser(data);
    }
    async function getSignalements() {
      const { data } = await signalementsApi.getAll();
      setSignalements(data!);
    }
    getSignalements();
    getUser();
  }, [user]);
  return (
    <ProtectedRoute redirectTo="/login" allowedRoles={["ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}

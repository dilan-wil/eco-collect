"use client"

import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/contexts/protected-route";
import { userApi } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useAuth()
  const { setUser } = useAppStore()
  useEffect(() => {
    async function getCurrentUserInfos(){
      if(!user) return
      const { data, error } = await userApi.getById(user?.id)
      setUser(data)
    }

    getCurrentUserInfos()
  }, [user])
  return (
    <ProtectedRoute redirectTo="/login" allowedRoles={['CITOYEN']}>{children}</ProtectedRoute>
  );
}

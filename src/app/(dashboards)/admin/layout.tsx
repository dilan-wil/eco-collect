"use client";

import ProtectedRoute from "@/contexts/protected-route";
import { signalementsApi } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setSignalements } = useAppStore()

  useEffect(() => {
    async function getSignalements(){
      const { data } = await signalementsApi.getAll()
      console.log(data)
      setSignalements(data!)
    }
    getSignalements()
  }, [user])
  return (
    <ProtectedRoute redirectTo="/login" allowedRoles={["ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}

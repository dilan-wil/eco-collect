"use client"
import { AppLayout } from "@/components/layout/AppLayout";
import ProtectedRoute from "@/contexts/protected-route";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute redirectTo="/login">
    <AppLayout>{children}</AppLayout>
    </ProtectedRoute>
  );
}

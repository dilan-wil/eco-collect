"use client"

import ProtectedRoute from "@/contexts/protected-route";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute redirectTo="/login" allowedRoles={['ADMIN']}>{children}</ProtectedRoute>
  );
}

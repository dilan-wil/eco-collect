"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Image from "next/image";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: string[];
  redirectTo: string;
};

export default function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (loading || hasChecked.current) return;
    hasChecked.current = true; // ✅ run only once per mount

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (allowedRoles?.length) {
      console.log(allowedRoles)
      console.log(user.user_metadata?.role)
      console.log("Because of role")
      const role = user.user_metadata?.role;
      if (!allowedRoles.includes(role)) {
        router.replace(redirectTo);
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="relative flex items-center justify-center">
          <div className="w-30 h-30 border-3 border-blue-300 border-t-primary rounded-full animate-spin"></div>
          {/* <Image
            src="/icon.png"
            alt="icon"
            width={50}
            height={50}
            className="absolute"
          /> */}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
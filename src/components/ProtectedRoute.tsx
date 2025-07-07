"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoading: sessionLoading } = useSessionContext();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true); // for spinner control

  useEffect(() => {
    const checkAccess = async () => {
      if (sessionLoading) return;

      if (!session?.user) {
        router.replace("/external/login");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("has_completed_survey")
          .eq("id", session.user.id)
          .single();

        if (error || !profile) {
          router.replace("/external/login");
          return;
        }

        if (!profile.has_completed_survey) {
          router.replace("/external/survey");
          return;
        }

        setHasAccess(true);
      } catch (err) {
        console.error("Error checking profile access:", err);
        router.replace("/external/login");
      } finally {
        setCheckingAccess(false); // done checking access
      }
    };

    checkAccess();
  }, [session, sessionLoading, router]);

  if (sessionLoading || checkingAccess) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}
      >
        <div className="spinner" />
        <style jsx>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #ccc;
            border-top: 4px solid #333;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  return hasAccess ? <>{children}</> : null;
}

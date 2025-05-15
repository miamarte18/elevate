"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";

export default function AuthCheck() {
  const router = useRouter();
  const { session, isLoading } = useSessionContext();

  useEffect(() => {
    const checkUserSurvey = async () => {
      if (isLoading) return; // still checking session
      if (!session?.user) {
        router.push("/external/login");
        return;
      }

      const userId = session.user.id;

      const { data, error } = await supabase
        .from("survey_responses")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No survey found
          router.push("/external/survey");
        } else {
          console.error("Supabase error:", error);
        }
        return;
      }

      // Survey exists
      router.push("/dashboard");
    };

    checkUserSurvey();
  }, [session, isLoading, router]);

  return <p>Checking your account...</p>;
}

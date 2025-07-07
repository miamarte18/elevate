// "use client";
// import { useEffect } from "react";
// import { useRouter, usePathname } from "next/navigation";
// import { useSessionContext } from "@supabase/auth-helpers-react";
// import { supabase } from "@/lib/supabase";

// export function useAuthSurveyCheck() {
//   const { session, isLoading } = useSessionContext();
//   const router = useRouter();
//   const pathname = usePathname();

//   // useEffect(() => {
//   //   // Don't run survey check logic on the survey page itself
//   //   if (pathname.startsWith("/external/survey")) return;

//   //   const checkSurvey = async () => {
//   //     if (isLoading) return;

//   //     if (!session?.user) {
//   //       router.push("/external/login");
//   //       return;
//   //     }

//   //     const { data, error } = await supabase
//   //       .from("survey_responses")
//   //       .select("id")
//   //       .eq("user_id", session.user.id)
//   //       .single();

//   //     if (error) {
//   //       if (error.code === "PGRST116") {
//   //         router.push("/external/survey");
//   //       } else {
//   //         console.error("Survey check error:", error);
//   //       }
//   //       return;
//   //     }

//   //     // Survey exists: nothing to do
//   //   };

//   //   checkSurvey();
//   // }, [session, isLoading, router, pathname]);
//   useEffect(() => {
//     if (pathname.startsWith("/external/survey") || isLoading) return;

//     const checkSurvey = async () => {
//       if (!session?.user) {
//         router.push("/external/login");
//         return;
//       }

//       const { data, error } = await supabase
//         .from("survey_responses")
//         .select("id")
//         .eq("user_id", session.user.id)
//         .single();

//       if (error) {
//         if (error.code === "PGRST116") {
//           router.push("/external/survey");
//         } else {
//           console.error("Survey check error:", error);
//         }
//       }
//     };

//     checkSurvey();
//   }, [session?.user, isLoading, router, pathname]);
// }

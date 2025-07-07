import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";

type SurveyResponse = {
  id: number;
  user_id: string;
  experience: string;
  interests: string;
  learning_style: string;
  time_commitment: string;
  goal: string;
};

export function useSurveyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");

  const {
    session,
    isLoading: loadingSession,
    supabaseClient,
  } = useSessionContext();

  const [form, setForm] = useState({
    experience: "",
    interests: "",
    learningStyle: "",
    timeCommitment: "",
    goal: "",
  });

  const [surveyData, setSurveyData] = useState<SurveyResponse | null>(null);
  const [checkingSurvey, setCheckingSurvey] = useState(true);

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const checkSurvey = async () => {
      if (!session?.user) {
        setCheckingSurvey(false);
        return;
      }

      try {
        // Check both survey data and profile completion status
        const [surveyResult, profileResult] = await Promise.all([
          supabaseClient
            .from("survey_responses")
            .select("*")
            .eq("user_id", session.user.id)
            .maybeSingle(),
          supabaseClient
            .from("profiles")
            .select("has_completed_survey")
            .eq("id", session.user.id)
            .single(),
        ]);

        const { data: surveyData, error: surveyError } = surveyResult;
        const { data: profileData, error: profileError } = profileResult;

        if (surveyError && surveyError.code !== "PGRST116") {
          console.error("Error fetching survey:", surveyError);
          return;
        }

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        if (surveyData && profileData?.has_completed_survey) {
          console.log("Survey already completed for user:", session.user.id);
          setSurveyData(surveyData);

          if (!edit) {
            router.replace("/dashboard"); // 🚨 This is the only redirect needed
            return;
          }

          setForm({
            experience: surveyData.experience,
            interests: surveyData.interests,
            learningStyle: surveyData.learning_style,
            timeCommitment: surveyData.time_commitment,
            goal: surveyData.goal,
          });
        } else {
          console.log(
            "No survey found or profile not marked as completed. User needs to complete it."
          );
        }
      } catch (err) {
        console.error("Error checking survey:", err);
      } finally {
        setCheckingSurvey(false);
      }
    };

    if (!loadingSession) {
      checkSurvey();
    }
  }, [loadingSession, session, supabaseClient, edit, router]);

  return {
    session,
    router,
    form,
    updateForm,
    checkingSurvey,
    surveyData,
    isLoading: loadingSession,
    supabase: supabaseClient,
  };
}

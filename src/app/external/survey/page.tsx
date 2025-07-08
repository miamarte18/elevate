"use client";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/SurveyPage.module.css";
import { useSurveyForm } from "@/app/external/survey/hooks/useSurveyForm";
import { useEffect } from "react";
export default function SurveyPage() {
  const {
    session,
    router,
    form,
    updateForm,
    checkingSurvey,
    surveyData,
    isLoading,
    supabase,
  } = useSurveyForm();

  // ✅ Wait until both Supabase session + survey check are complete
  const isLoadingSession = isLoading || checkingSurvey;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error("User session not found. Please log in again.");
      return;
    }

    if (
      !form.experience ||
      !form.interests ||
      !form.learningStyle ||
      !form.timeCommitment ||
      !form.goal
    ) {
      toast.error("🚨 Please complete all fields before submitting.");
      return;
    }

    const payload = {
      user_id: session.user.id,
      experience: form.experience,
      interests: form.interests,
      learning_style: form.learningStyle,
      time_commitment: form.timeCommitment,
      goal: form.goal,
    };
    try {
      //First we check if theres exisiting survey data for the user

      let response;

      if (surveyData) {
        //if the user already has survey data, update it
        response = await supabase
          .from("survey_responses")
          .update(payload)
          .eq("id", surveyData.id);
      } else {
        //if no existing data, we insert a new record
        response = await supabase.from("survey_responses").insert(payload);
      }

      if (response.error) {
        toast.error(`Error saving your responses: ${response.error.message}`);
        return;
      }

      // Update the profiles table to mark survey as completed
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ has_completed_survey: true })
        .eq("id", session.user.id);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        toast.error(
          "Survey saved but there was an issue updating your profile."
        );
        return;
      }

      toast.success("🎉 Your responses have been saved successfully!");

      // Generate roadmap after successful survey submission
      try {
        const roadmapResponse = await fetch("/api/generate-roadmap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: session.user.id }),
        });

        if (!roadmapResponse.ok) {
          console.error("Failed to generate roadmap");
          toast.error(
            "Survey saved but couldn't generate your roadmap. You can generate it from the dashboard."
          );
        } else {
          toast.success("🚀 Your personalized roadmap has been generated!");
        }
      } catch (roadmapError) {
        console.error("Error generating roadmap:", roadmapError);
        toast.error(
          "Survey saved but couldn't generate your roadmap. You can generate it from the dashboard."
        );
      }

      // Use replace instead of push to avoid back button issues
      // Add a small delay to ensure the database update has propagated
      setTimeout(() => {
        router.replace("/dashboard");
      }, 2000); // Increased delay to allow roadmap generation
    } catch (error) {
      toast.error("An error ocurred while submitting your survey.");
    }
  };

  // 🔒 Show loading UI while checking session and survey state
  if (isLoadingSession) {
    return (
      <div className={styles.page}>
        <ToastContainer autoClose={3000} />
        <p>🔄 Loading your survey data...</p>
      </div>
    );
  }

  // // Show spinner and toast while session is being determined
  // useEffect(() => {
  //   if (!session?.user) {
  //     toast.info("Checking your survey...", { toastId: "session-loading" });
  //   } else {
  //     toast.dismiss("session-loading");
  //   }
  // }, [session?.user]);

  return (
    <div id="survey" className={styles.page}>
      <ToastContainer autoClose={3000} />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Let us get to know you!</h2>
            <p>
              Your answers will help us create your personalized learning path.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <SurveySection
              title="1. What is your current experience level in tech?"
              options={[
                { value: "beginner", label: "Beginner (New to tech)" },
                {
                  value: "intermediate",
                  label: "Intermediate (Some experience)",
                },
                {
                  value: "advanced",
                  label: "Advanced (Experienced professional)",
                },
              ]}
              name="experience"
              selectedValue={form.experience}
              onChange={updateForm}
            />

            <div className={styles.section}>
              <h3>2. What area of tech are you most interested in?</h3>
              <select
                value={form.interests}
                onChange={(e) => updateForm("interests", e.target.value)}
                className={styles.select}
              >
                <option value="">Select an area</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">
                  Mobile App Development
                </option>
                <option value="data-science">Data Science & Analytics</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="cloud-computing">Cloud Computing</option>
                <option value="ai-ml">
                  Artificial Intelligence & Machine Learning
                </option>
                <option value="devops">DevOps</option>
                <option value="ux-ui">UX/UI Design</option>
              </select>
            </div>

            <SurveySection
              title="3. What is your preferred learning style?"
              options={[
                { value: "video", label: "Video tutorials" },
                { value: "articles", label: "Articles and written guides" },
                {
                  value: "interactive",
                  label: "Interactive projects and exercises",
                },
              ]}
              name="learningStyle"
              selectedValue={form.learningStyle}
              onChange={updateForm}
            />

            <div className={styles.section}>
              <h3>4. How much time can you dedicate to learning each week?</h3>
              <select
                value={form.timeCommitment}
                onChange={(e) => updateForm("timeCommitment", e.target.value)}
                className={styles.select}
              >
                <option value="">Select time commitment</option>
                <option value="1-3">1–3 hours per week</option>
                <option value="4-7">4–7 hours per week</option>
                <option value="8-15">8–15 hours per week</option>
                <option value="16+">16+ hours per week</option>
              </select>
            </div>

            <div className={styles.section}>
              <h3>5. What is your main learning goal?</h3>
              <textarea
                value={form.goal}
                onChange={(e) => updateForm("goal", e.target.value)}
                className={styles.textarea}
                placeholder="e.g. Become a full-stack developer"
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SurveySection({
  title,
  options,
  name,
  selectedValue,
  onChange,
}: {
  title: string;
  options: { value: string; label: string }[];
  name: string;
  selectedValue: string;
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className={styles.section}>
      <h3>{title}</h3>
      {options.map(({ value, label }) => (
        <div key={value} className={styles.label}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name={name}
              value={value}
              checked={selectedValue === value}
              onChange={() => onChange(name, value)}
            />
            {label}
          </label>
        </div>
      ))}
    </div>
  );
}

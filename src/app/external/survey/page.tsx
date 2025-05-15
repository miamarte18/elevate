"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";

export default function SurveyPage() {
  const router = useRouter();
  const { session, isLoading } = useSessionContext();

  const [interests, setInterests] = useState<string[]>([]);
  const [skillLevel, setSkillLevel] = useState("");
  const [goal, setGoal] = useState("");
  const [checkingSurvey, setCheckingSurvey] = useState(true);

  useEffect(() => {
    const checkSurvey = async () => {
      if (!session?.user) return;

      try {
        const { data, error } = await supabase
          .from("survey_responses")
          .select("id")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error fetching survey responses:", error.message);
          return;
        }

        if (data.length > 0) {
          // User has completed the survey, redirect to dashboard
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Unexpected error during survey check:", err);
      } finally {
        setCheckingSurvey(false);
      }
    };

    checkSurvey();
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = session?.user?.id;
    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    // Ensure interests is a string
    const surveyData = {
      user_id: userId,
      interests: interests.join(", "), // ✅ convert array to comma-separated string
      skill_level: skillLevel,
      goal,
    };

    console.log("Submitting survey data:", surveyData); // Debug output

    const { error } = await supabase
      .from("survey_responses")
      .upsert([surveyData], {
        onConflict: "user_id",
      });

    if (error) {
      alert("Failed to save survey.");
      console.error(error);
      return;
    }

    router.push("/dashboard");
  };

  if (isLoading || checkingSurvey) return <p>Loading...</p>;
  if (!session?.user) return <p>You must be logged in.</p>;

  return (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        color: "#000000",
      }}
    >
      <form onSubmit={handleSubmit}>
        <h1>Tech Survey</h1>

        <fieldset>
          <legend>What interests you?</legend>
          {["AI", "Cloud", "Cybersecurity", "Data Science", "Coding"].map(
            (topic) => (
              <label key={topic} style={{ display: "block", margin: "5px 0" }}>
                <input
                  type="checkbox"
                  value={topic}
                  checked={interests.includes(topic)}
                  onChange={() =>
                    setInterests((prev) =>
                      prev.includes(topic)
                        ? prev.filter((i) => i !== topic)
                        : [...prev, topic]
                    )
                  }
                />{" "}
                {topic}
              </label>
            )
          )}
        </fieldset>

        <fieldset style={{ marginTop: "1rem" }}>
          <legend>Your skill level</legend>
          {["Beginner", "Intermediate", "Advanced"].map((level) => (
            <label key={level} style={{ display: "block", margin: "5px 0" }}>
              <input
                type="radio"
                value={level}
                checked={skillLevel === level}
                onChange={() => setSkillLevel(level)}
              />{" "}
              {level}
            </label>
          ))}
        </fieldset>

        <label style={{ display: "block", marginTop: "1rem" }}>
          Learning Goal:
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="e.g. Get a job in cloud computing"
            required
            style={{ display: "block", marginTop: "0.5rem", width: "100%" }}
          />
        </label>

        <button
          type="submit"
          style={{ marginTop: "1.5rem", padding: "0.5rem 1rem" }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

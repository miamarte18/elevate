"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "lib/supabase";
import { useSessionContext } from "@supabase/auth-helpers-react";
import styles from "../styles/SurveyPage.module.css";

export default function SurveyPage() {
  const router = useRouter();
  const { session, isLoading } = useSessionContext();

  const [experience, setExperience] = useState("");
  const [interests, setInterests] = useState("");
  const [learningStyle, setLearningStyle] = useState("");
  const [timeCommitment, setTimeCommitment] = useState("");
  const [goal, setGoal] = useState("");
  const [checkingSurvey, setCheckingSurvey] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const checkSurvey = async () => {
      if (!session?.user) return;
      try {
        const { data, error } = await supabase
          .from("survey_responses")
          .select("id")
          .eq("user_id", session.user.id)
          .single();

        if (data) {
          setHasSubmitted(true);
          router.push("/dashboard");
        } else {
          setCheckingSurvey(false);
        }
      } catch (error) {
        console.error("Error checking survey status", error);
        setCheckingSurvey(false);
      }
    };

    checkSurvey();
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user || hasSubmitted) return;

    const { error } = await supabase.from("survey_responses").insert({
      user_id: session.user.id,
      experience,
      interests,
      learning_style: learningStyle,
      time_commitment: timeCommitment,
      goal,
    });

    if (error) {
      console.error("Error submitting survey", error);
    } else {
      setHasSubmitted(true);
      router.push("/dashboard");
    }
  };

  if (checkingSurvey || isLoading) return <div>Loading...</div>;

  return (
    <div id="survey" className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h2>Let us get to know you!</h2>
            <p>
              Your answers will help us create your personalized learning path.
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.section}>
              <h3>1. What is your current experience level in tech?</h3>
              {["beginner", "intermediate", "advanced"].map((level) => (
                <div className={styles.label}>
                  <label key={level} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="experience"
                      value={level}
                      checked={experience === level}
                      onChange={(e) => setExperience(e.target.value)}
                    />
                    {level === "beginner" && "Beginner (New to tech)"}
                    {level === "intermediate" &&
                      "Intermediate (Some experience)"}
                    {level === "advanced" &&
                      "Advanced (Experienced professional)"}
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h3>2. What area of tech are you most interested in?</h3>
              <select
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
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

            <div className={styles.section}>
              <h3>3. What is your preferred learning style?</h3>
              {["video", "articles", "interactive"].map((style) => (
                <div className={styles.label}>
                  <label key={style} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="learningStyle"
                      value={style}
                      checked={learningStyle === style}
                      onChange={(e) => setLearningStyle(e.target.value)}
                    />
                    {style === "video" && "Video tutorials"}
                    {style === "articles" && "Articles and written guides"}
                    {style === "interactive" &&
                      "Interactive projects and exercises"}
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.section}>
              <h3>4. How much time can you dedicate to learning each week?</h3>
              <select
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                className={styles.select}
              >
                <option value="">Select time commitment</option>
                <option value="1-3">1-3 hours per week</option>
                <option value="4-7">4-7 hours per week</option>
                <option value="8-15">8-15 hours per week</option>
                <option value="16+">16+ hours per week</option>
              </select>
            </div>

            <div className={styles.section}>
              <h3>5. What is your goal in the next 6 months?</h3>
              {["job", "portfolio", "skills", "explore"].map((g) => (
                <div className={styles.label}>
                  <label key={g} className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="goal"
                      value={g}
                      checked={goal === g}
                      onChange={(e) => setGoal(e.target.value)}
                    />
                    {g === "job" && "Get a job in tech"}
                    {g === "portfolio" && "Build a portfolio of projects"}
                    {g === "skills" && "Improve my current skills"}
                    {g === "explore" && "Just exploring tech"}
                  </label>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={hasSubmitted}
            >
              Submit and Get My Recommendations
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

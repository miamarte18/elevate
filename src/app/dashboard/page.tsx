"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { supabase } from "@/lib/supabase";

import styles from "./dashboard.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useRoadmap } from "./hooks/useRoadmap";
import RoadmapCard from "./components/RoadmapCard";
export default function DashboardPage() {
  const { session } = useSessionContext();
  const [username, setUsername] = useState<string | null>(null);
  const user = session?.user;

  // Use the roadmap hook
  const {
    roadmapData,
    isLoading: isLoadingRoadmap,
    isGenerating,
    error: roadmapError,
    generateRoadmap,
    updateResourceCompletion,
  } = useRoadmap();

  // useEffect(() => {
  //   try {
  //     if (!isLoading && session?.user) {
  //       setUser(session.user);

  //       const fetchUsername = async () => {
  //         const { data, error } = await supabase
  //           .from("profiles")
  //           .select("username")
  //           .eq("id", session.user.id)
  //           .maybeSingle(); // safer, doesn’t throw if no row

  //         console.log("Fetching username for user id:", session.user.id);
  //         console.log("Returned data:", data);
  //         console.log("Returned error:", error);

  //         if (error) {
  //           console.error("Supabase error:", error.message);
  //         } else if (data) {
  //           setUsername(data.username);
  //         } else {
  //           console.warn("No profile found for user.");
  //         }
  //       };
  //       fetchUsername();
  //       setUser(session.user);
  //     } else if (!isLoading && !session?.user) {
  //       router.push("/external/login");
  //     }
  //   } catch (err) {
  //     console.error("Unexpected error during fetchUsername:", err);
  //   }
  // }, [session, isLoading, router, supabase]);
  useEffect(() => {
    const fetchUsername = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching username:", error.message);
      } else if (data) {
        setUsername(data.username);
      }
    };

    fetchUsername();
  }, [user]);

  if (!user) return <div>Loading...</div>;

  // Loading state for roadmap
  if (isLoadingRoadmap) {
    return (
      <div className={styles.container}>
        <ProtectedRoute>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading your personalized roadmap...</p>
          </div>
        </ProtectedRoute>
      </div>
    );
  }

  // Error state
  if (roadmapError) {
    return (
      <div className={styles.container}>
        <ProtectedRoute>
          <div className={styles.errorContainer}>
            <h2 className={styles.errorMessage}>Error loading roadmap</h2>
            <p>{roadmapError}</p>
            <button
              onClick={generateRoadmap}
              disabled={isGenerating}
              className={styles.generateButton}
            >
              {isGenerating ? "Generating..." : "Try Again"}
            </button>
          </div>
        </ProtectedRoute>
      </div>
    );
  }

  // No roadmap state
  if (!roadmapData) {
    return (
      <div className={styles.container}>
        <ProtectedRoute>
          <div>
            <h1 className={styles.header}>
              Welcome back, {username ?? user.email}!
            </h1>
            <p className={styles.subtext}>
              Let's create your personalized learning roadmap.
            </p>
          </div>

          <div className={styles.noRoadmapContainer}>
            <h2 className={styles.noRoadmapTitle}>No Learning Roadmap Found</h2>
            <p className={styles.noRoadmapDescription}>
              It looks like you haven't generated your personalized learning
              roadmap yet. Click the button below to create one based on your
              survey responses.
            </p>
            <button
              onClick={generateRoadmap}
              disabled={isGenerating}
              className={styles.generateButton}
            >
              {isGenerating ? (
                <>
                  <div
                    className={styles.loadingSpinner}
                    style={{ width: "20px", height: "20px" }}
                  ></div>
                  Generating Your Roadmap...
                </>
              ) : (
                "🚀 Generate My Learning Roadmap"
              )}
            </button>
          </div>
        </ProtectedRoute>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <ProtectedRoute>
        <div>
          <h1 className={styles.header}>
            Welcome back, {username ?? user.email}!
          </h1>
          <p className={styles.subtext}>
            Here are your personalized learning recommendations.
          </p>
        </div>
      </ProtectedRoute>

      {/* Personalized Message */}
      {roadmapData.personalizedMessage && (
        <div className={styles.personalizedMessage}>
          {roadmapData.personalizedMessage}
        </div>
      )}

      {/* Progress Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          Your Learning Path: {roadmapData.learningPath}
        </div>
        <div className={styles.cardBody}>
          <div>
            <p className="font-medium text-gray-900 mb-1">
              You're making great progress!
            </p>
            <p className={styles.subtext}>
              {roadmapData.resources?.filter((r) => r.completed).length || 0} of{" "}
              {roadmapData.resources?.length || 0} resources completed
            </p>
          </div>

          {roadmapData.weeklyGoal && (
            <div className={styles.weeklyGoal}>
              🎯 Weekly Goal: {roadmapData.weeklyGoal}
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">
              Current progress
            </h3>
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBar}
                style={{ width: `${roadmapData.progressPercentage || 0}%` }}
              ></div>
            </div>
            <p className={styles.textGray}>
              {roadmapData.progressPercentage || 0}% complete
            </p>
          </div>
        </div>
      </div>

      {/* Learning Resources Section */}
      <section className={styles.section}>
        <h2 className={styles.headerSection}>Your Learning Resources</h2>
        <div className={styles.grid2Cols}>
          {roadmapData.resources?.map((resource, index) => (
            <RoadmapCard
              key={resource.id || index}
              resource={resource}
              onToggleComplete={updateResourceCompletion}
            />
          ))}
        </div>
      </section>

      {/* Regenerate Your Plan Section */}
      <section className={styles.section}>
        <h2 className={styles.headerSection}>Regenerate your plan</h2>
        <div className={styles.grid2Cols}>
          <div className={styles.cardSmall}>
            <h4>Need a new roadmap?</h4>
            <p>
              Refresh your learning path to get updated recommendations based on
              your goals and progress.
            </p>
            <button
              onClick={generateRoadmap}
              disabled={isGenerating}
              className={styles.regenerateButton}
            >
              {isGenerating ? "Regenerating..." : "🔄 Regenerate"}
            </button>
          </div>
          <div className={styles.cardSmall}>
            <h4>Update your preferences</h4>
            <p>
              Want to change your learning style or goals? Update your survey
              responses first.
            </p>
            <button
              onClick={() =>
                (window.location.href = "/external/survey?edit=true")
              }
              className={styles.buttonPrimary}
            >
              Edit Survey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

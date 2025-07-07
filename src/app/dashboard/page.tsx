"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

import { supabase } from "@/lib/supabase";

import styles from "./dashboard.module.css";
import ProtectedRoute from "@/components/ProtectedRoute";
export default function DashboardPage() {
  const { session } = useSessionContext();
  const [username, setUsername] = useState<string | null>(null);
  const user = session?.user;

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

      {/* Progress Card */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          Your Learning Path: Web Development
        </div>
        <div className={styles.cardBody}>
          <div>
            <p className="font-medium text-gray-900 mb-1">
              You're making great progress!
            </p>
            <p className={styles.subtext}>3 resources completed this week</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-900">
              Current progress
            </h3>
            <div className={styles.progressBarWrapper}>
              <div className={styles.progressBar}></div>
            </div>
            <p className={styles.textGray}>45% complete</p>
          </div>
        </div>
      </div>

      {/* Continue Learning Section */}
      <section className={styles.section}>
        <h2 className={styles.headerSection}>Continue Learning</h2>
        <div className={styles.grid2Cols}>
          {/* Card 1 */}
          <div className={styles.cardSmall}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/270/270798.png"
              alt="React"
            />
            <h4>React Basics</h4>
            <p>Learn the fundamentals of React.js and build dynamic UIs.</p>
            <button className={styles.buttonPrimary}>Continue</button>
          </div>

          {/* Card 2 */}
          <div className={styles.cardSmall}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/919/919825.png"
              alt="JavaScript"
            />
            <h4>JavaScript Essentials</h4>
            <p>Understand core JavaScript concepts for web development.</p>
            <button className={styles.buttonPrimary}>Continue</button>
          </div>
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
              your goals.
            </p>
            <button className={styles.buttonPrimary}>Regenerate</button>
          </div>
          <div className={styles.cardSmall}>
            <h4>Customize your plan</h4>
            <p>
              Adjust your preferences to better tailor your learning experience.
            </p>
            <button className={styles.buttonPrimary}>Customize</button>
          </div>
        </div>
      </section>
    </div>
  );
}

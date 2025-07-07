"use client";
import React from "react";
import styles from "../dashboard.module.css";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to fetch user:", error.message);
        return;
      }

      if (user) {
        setEmail(user.email || "");

        // Get the username from the 'profiles' table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError.message);
        } else {
          setUsername(profile.username);
        }
      }
    };

    getUserData();
  }, [supabase]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //function to handle form submission
  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const userEmail = sessionData?.session?.user?.email;
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: userEmail || "",
      password: currentPassword,
    });

    if (signInError) {
      toast.error("Current password is incorrect.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast.error("Failed to update password: " + error.message);
    } else {
      toast.success("Password updated successfully! You will be logged out for security reasons.");
      
      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Show a warning toast and then sign out after a delay
      setTimeout(() => {
        toast("Signing you out for security...", {
          icon: "🔒",
          duration: 2000,
        });
        setTimeout(async () => {
          await supabase.auth.signOut();
          window.location.href = "/external/login";
        }, 2000);
      }, 2000);
    }
  };
  //download survey as pdf
  const handleDownloadSurveyPDF = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        toast.error("Unable to fetch user data.");
        return;
      }

      console.log("Fetching survey for user:", user.id);

      // Try to get survey data with better error handling - get the most recent one
      const { data: surveyData, error: surveyError } = await supabase
        .from("survey_responses")
        .select("experience, interests, learning_style, time_commitment, goal, inserted_at, updated_at")
        .eq("user_id", user.id)
        .order("inserted_at", { ascending: false })
        .limit(1)
        .single();

      console.log("Survey query result:", { surveyData, surveyError });

      if (surveyError) {
        console.error("Survey error:", surveyError);
        if (surveyError.code === "PGRST116") {
          toast.error("No survey found. Please complete your survey first.");
        } else {
          toast.error("Error fetching survey: " + surveyError.message);
        }
        return;
      }

      if (!surveyData) {
        toast.error("Survey not found or not completed.");
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(16);
      doc.text("Your Survey Responses", 10, 20);
      doc.setFontSize(12);

      // Add completion date if available
      if (surveyData.inserted_at) {
        const completionDate = new Date(surveyData.inserted_at).toLocaleDateString();
        doc.text(`Completed on: ${completionDate}`, 10, 30);
      }

      let y = 50;
      
      // Create a more readable format
      const surveyFields = [
        { key: "experience", label: "Experience Level" },
        { key: "interests", label: "Interests" },
        { key: "learning_style", label: "Learning Style" },
        { key: "time_commitment", label: "Time Commitment" },
        { key: "goal", label: "Goal" },
      ];

      surveyFields.forEach(({ key, label }) => {
        if (surveyData[key as keyof typeof surveyData]) {
          doc.text(`${label}: ${surveyData[key as keyof typeof surveyData]}`, 10, y);
          y += 15;
          if (y > 250) {
            doc.addPage();
            y = 20;
          }
        }
      });

      doc.save("my_survey_responses.pdf");
      toast.success("Survey downloaded successfully!");
    } catch (error) {
      console.error("Error downloading survey:", error);
      toast.error("Failed to download survey. Please try again.");
    }
  };

  return (
    <div id="dashboard-settings" className={styles.dashboardSection}>
      <div className={styles.headerWrapper}>
        <h1 className={styles.heading}>Settings</h1>
        <p className={styles.subheading}>
          Manage your account settings and preferences.
        </p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.sectionTitle}>Account Information</h2>
          </div>

          <div className={styles.cardBody}>
            <form id="settings-form" onSubmit={handleSaveChanges}>
              <div className={styles.formGroup}>
                <div>
                  <label htmlFor="username" className={styles.label}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    className={styles.input}
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="email" className={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    className={styles.input}
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="current-password" className={styles.label}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="current-password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="new-password" className={styles.label}>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="new-password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirm-new-password"
                    className={styles.label}
                  >
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirm-new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleDownloadSurveyPDF}
                  >
                    <svg
                      className={styles.icon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download My Survey
                  </button>

                  <button type="submit" className={styles.primaryButton}>
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

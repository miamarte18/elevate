"use client";
import React from "react";
import styles from "../dashboard.module.css";
import toast from "react-hot-toast";
import jsPDF from "jspdf";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

const SettingsPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
  }, []);

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
      toast.success("Your password has been updated successfully.");
      // Optionally clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };
  //download survey as pdf
  const handleDownloadSurveyPDF = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      toast.error("Unable to fetch user data.");
      return;
    }

    const { data: surveyData, error: surveyError } = await supabase
      .from("survey_responses")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (surveyError || !surveyData) {
      toast.error("Survey not found or not completed.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Your Survey Responses", 10, 10);
    doc.setFontSize(12);

    let y = 20;
    for (const [key, value] of Object.entries(surveyData)) {
      const line = `${key}: ${value}`;
      doc.text(line, 10, y);
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    }

    doc.save("my_survey.pdf");
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

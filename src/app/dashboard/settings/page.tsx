import React from "react";
import styles from "../dashboard.module.css";

const SettingsPage: React.FC = () => {
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
            <form id="settings-form">
              <div className={styles.formGroup}>
                <div>
                  <label htmlFor="username" className={styles.label}>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value="johnsmith"
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
                    value="john.smith@example.com"
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
                    id="confirm-new-password"
                    className={styles.input}
                    placeholder="••••••••"
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.secondaryButton}>
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

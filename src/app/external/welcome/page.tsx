// pages/external/welcome.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  HiClipboardList,
  HiLightningBolt,
  HiAcademicCap,
} from "react-icons/hi";
import styles from "@/app/external/styles/HomePage.module.css"; // adjust path if needed

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className={styles.sectionWrapper}>
      <div className={styles.sectionHeader}>
        <h1 className={styles.title}>Welcome to ElevateU</h1>
        <p className={styles.subtitle}>
          Your personalized tech learning journey starts here.
        </p>
      </div>

      <div className={styles.cardGrid}>
        {/* Card 1 */}
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <HiClipboardList className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>Take a Quick Survey</h3>
          <p className={styles.cardText}>
            Answer 5 simple questions about your tech interests, experience
            level, and learning preferences.
          </p>
        </div>

        {/* Card 2 */}
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <HiLightningBolt className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>AI Analyzes Your Needs</h3>
          <p className={styles.cardText}>
            Our advanced AI processes your responses to understand exactly what
            you need to succeed.
          </p>
        </div>

        {/* Card 3 */}
        <div className={styles.card}>
          <div className={styles.iconWrapper}>
            <HiAcademicCap className={styles.icon} />
          </div>
          <h3 className={styles.cardTitle}>Get Personalized Resources</h3>
          <p className={styles.cardText}>
            Receive curated learning materials tailored specifically to your
            goals and learning style.
          </p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <button
          onClick={() => router.push("/external/survey")}
          style={{
            backgroundColor: "#4f46e5",
            color: "white",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontWeight: "600",
            fontSize: "1rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Start Your Survey
        </button>
      </div>
    </div>
  );
}

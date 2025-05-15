import Link from "next/link";
import styles from "./styles/HomePage.module.css";
import {
  HiClipboardList,
  HiLightningBolt,
  HiAcademicCap,
} from "react-icons/hi"; // You can use HeroIcons via react-icons

export default function HomePage() {
  return (
    <div>
      <div className={styles.gradientBackground}>
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
          <div className={styles.textContainer}>
            <h1 className={styles.Text}>Elevate Your Tech Skills, Your Way.</h1>
            <p className={styles.Text2}>
              Personalized tech learning powered by AI. From coding to cloud
              computing, discover a smarter way to learn — wherever you are.
            </p>
          </div>
          <Link href="/external/signup">
            <button className={styles.getStartedBtn}>Get Started</button>
          </Link>
        </div>
      </div>
      {/* HOW IT WORKS SECTION */}
      <div className={styles.sectionWrapper}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.title}>How ElevateU Works</h2>
          <p className={styles.subtitle}>
            Our AI-powered platform creates a personalized learning journey
            based on your goals, experience, and preferences.
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
              Our advanced AI processes your responses to understand exactly
              what you need to succeed.
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
      </div>
    </div>
  );
}

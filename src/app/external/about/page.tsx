export const dynamic = "force-static";
export const revalidate = 0;

export const metadata = {
  title: "About Us",
};
import styles from "./About.module.css";

import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function AboutPage() {
  return (
    <div id="about" className="page">
      <div className={styles.wrapper}>
        <h1 className={styles.heading}>About ElevateU</h1>
        <p className={styles.subheading}>
          Breaking down barriers to tech education through personalized
          AI-powered learning.
        </p>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.flexContainer}>
          <div className={styles.left}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.paragraph}>
              At ElevateU, we believe everyone deserves a clear path into tech.
              Too many students feel lost in their learning journey, overwhelmed
              by options but unsure where to start.
            </p>
            <p className={styles.paragraph}>
              Our AI-powered platform bridges this gap by creating personalized
              learning experiences that match your unique goals, experience
              level, and learning style.
            </p>
            <p className={styles.paragraph}>
              Whether you're a complete beginner or looking to advance your
              skills, ElevateU provides the guidance you need to succeed in
              today's tech landscape.
            </p>
          </div>

          <div className={styles.right}>
            <div className={styles.card}>
              <h3 className={styles.sectionTitle}>How Our AI Works</h3>
              <p className={styles.paragraph}>
                Our recommendation engine analyzes your survey responses against
                thousands of learning resources to find the perfect match for
                your needs.
              </p>

              <div>
                {[
                  "Considers your current skill level to avoid content that's too basic or too advanced",
                  "Matches your preferred learning style (videos, articles, interactive projects)",
                  "Aligns with your career goals and available study time",
                  "Continuously improves recommendations based on your feedback",
                ].map((item, index) => (
                  <div key={index} className={styles.checkItem}>
                    <CheckCircleIcon className={styles.checkIcon} />
                    <p className={styles.checkText}>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.storyBox}>
          <h3 className={styles.storyTitle}>The Story Behind ElevateU</h3>
          <p className={styles.storyText}>
            ElevateU was born from our founder's frustration with the fragmented
            tech education landscape. After spending countless hours helping
            friends navigate their learning journeys, she realized there had to
            be a better way.
          </p>
          <p className={styles.storyText}>
            By combining AI technology with expert curation, we've created a
            platform that makes tech education accessible, personalized, and
            effective for everyone.
          </p>
        </div>
      </div>
    </div>
  );
}

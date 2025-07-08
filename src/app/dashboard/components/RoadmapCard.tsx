import React from "react";
import styles from "../dashboard.module.css";

interface Resource {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  type: string;
  icon: string;
  completed: boolean;
}

interface RoadmapCardProps {
  resource: Resource;
  onToggleComplete: (resourceId: number, completed: boolean) => void;
}

const getDefaultIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "interactive":
      return "https://cdn-icons-png.flaticon.com/512/2991/2991148.png";
    case "video":
      return "https://cdn-icons-png.flaticon.com/512/3721/3721964.png";
    case "project":
      return "https://cdn-icons-png.flaticon.com/512/2821/2821005.png";
    case "reading":
      return "https://cdn-icons-png.flaticon.com/512/3145/3145765.png";
    default:
      return "https://cdn-icons-png.flaticon.com/512/2991/2991148.png";
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "beginner":
      return "#10B981"; // green
    case "intermediate":
      return "#F59E0B"; // yellow
    case "advanced":
      return "#EF4444"; // red
    default:
      return "#6B7280"; // gray
  }
};

export default function RoadmapCard({
  resource,
  onToggleComplete,
}: RoadmapCardProps) {
  const handleToggleComplete = () => {
    onToggleComplete(resource.id, !resource.completed);
  };

  return (
    <div
      className={`${styles.cardSmall} ${
        resource.completed ? styles.completedCard : ""
      }`}
    >
      <div className={styles.cardImageContainer}>
        <img
          src={
            resource.icon.startsWith("http")
              ? resource.icon
              : getDefaultIcon(resource.type)
          }
          alt={resource.title}
          className={styles.cardImage}
        />
        <div className={styles.cardBadge}>
          <span
            className={styles.difficultyBadge}
            style={{ backgroundColor: getDifficultyColor(resource.difficulty) }}
          >
            {resource.difficulty}
          </span>
          <span className={styles.typeBadge}>{resource.type}</span>
        </div>
      </div>

      <div className={styles.cardContent}>
        <h4 className={styles.cardTitle}>{resource.title}</h4>
        <p className={styles.cardDescription}>{resource.description}</p>

        <div className={styles.cardMeta}>
          <span className={styles.duration}>⏱️ {resource.duration}</span>
          {resource.completed && (
            <span className={styles.completedBadge}>✅ Completed</span>
          )}
        </div>

        <div className={styles.cardActions}>
          <button
            className={
              resource.completed ? styles.buttonSecondary : styles.buttonPrimary
            }
            onClick={handleToggleComplete}
          >
            {resource.completed ? "Mark Incomplete" : "Mark Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

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

interface Milestone {
  week: number;
  goal: string;
  completed: boolean;
}

interface RoadmapData {
  personalizedMessage: string;
  learningPath: string;
  progressPercentage: number;
  weeklyGoal: string;
  resources: Resource[];
  milestones: Milestone[];
}

export function useRoadmap() {
  const { session } = useSessionContext();
  const [roadmapData, setRoadmapData] = useState<RoadmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    if (!session?.user) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/roadmap?userId=${session.user.id}`);

      if (response.ok) {
        const data = await response.json();
        setRoadmapData(data.roadmap);
        setError(null);
      } else if (response.status === 404) {
        // No roadmap found, this is expected for new users
        setRoadmapData(null);
        setError(null);
      } else {
        throw new Error("Failed to fetch roadmap");
      }
    } catch (err) {
      console.error("Error fetching roadmap:", err);
      setError("Failed to load roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const generateRoadmap = async () => {
    if (!session?.user) return;

    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmapData(data.roadmap);
      } else {
        throw new Error("Failed to generate roadmap");
      }
    } catch (err) {
      console.error("Error generating roadmap:", err);
      setError("Failed to generate roadmap");
    } finally {
      setIsGenerating(false);
    }
  };

  const updateResourceCompletion = async (
    resourceId: number,
    completed: boolean
  ) => {
    if (!session?.user) return;

    try {
      const response = await fetch("/api/roadmap", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
          resourceId,
          completed,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setRoadmapData(data.roadmap);
      } else {
        throw new Error("Failed to update resource");
      }
    } catch (err) {
      console.error("Error updating resource:", err);
      setError("Failed to update progress");
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [session?.user]);

  return {
    roadmapData,
    isLoading,
    isGenerating,
    error,
    generateRoadmap,
    updateResourceCompletion,
    refetchRoadmap: fetchRoadmap,
  };
}

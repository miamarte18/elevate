import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  console.log("🚀 POST /api/generate-roadmap-mock called");
  try {
    const { userId } = await request.json();
    console.log("📝 User ID:", userId);

    if (!userId) {
      console.log("❌ No user ID provided");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching survey data...");
    // Fetch user's survey response from database
    const { data: surveyData, error: surveyError } = await supabase
      .from("survey_responses")
      .select("*")
      .eq("user_id", userId)
      .single();

    console.log("📊 Survey data:", surveyData);
    console.log("❌ Survey error:", surveyError);

    // If no survey data found, create a default/demo roadmap
    let userPreferences = surveyData;
    if (surveyError || !surveyData) {
      console.log("❌ Survey data not found, using default preferences");
      userPreferences = {
        experience: "beginner",
        interests: "web development",
        learning_style: "interactive",
        time_commitment: "4-7 hours",
        goal: "become a software developer",
      };
    }

    // Generate MOCK roadmap data based on survey
    const mockRoadmapData = {
      personalizedMessage: `Great choice pursuing ${userPreferences.goal}! With your ${userPreferences.experience} level and ${userPreferences.learning_style} learning style, you're well-positioned to succeed. Dedicating ${userPreferences.time_commitment} hours per week to ${userPreferences.interests} will help you build strong foundations.`,
      learningPath: `${userPreferences.interests} Development`,
      progressPercentage: 0,
      weeklyGoal: `Study ${userPreferences.time_commitment} hours per week focusing on ${userPreferences.interests}`,
      resources: [
        {
          id: 1,
          title: "HTML & CSS Fundamentals",
          description:
            "Learn the building blocks of web development with comprehensive HTML and CSS training.",
          duration: "8 hours",
          difficulty:
            userPreferences.experience === "beginner"
              ? "Beginner"
              : "Intermediate",
          type:
            userPreferences.learning_style === "interactive"
              ? "Interactive"
              : "Video",
          icon: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
          completed: false,
        },
        {
          id: 2,
          title: "JavaScript Basics",
          description:
            "Master the fundamentals of JavaScript programming with practical examples.",
          duration: "12 hours",
          difficulty:
            userPreferences.experience === "beginner"
              ? "Beginner"
              : "Intermediate",
          type:
            userPreferences.learning_style === "interactive"
              ? "Interactive"
              : "Video",
          icon: "https://cdn-icons-png.flaticon.com/512/919/919825.png",
          completed: false,
        },
        {
          id: 3,
          title: "React Fundamentals",
          description:
            "Build dynamic user interfaces with React.js and modern JavaScript.",
          duration: "16 hours",
          difficulty: "Intermediate",
          type: "Project",
          icon: "https://cdn-icons-png.flaticon.com/512/919/919851.png",
          completed: false,
        },
        {
          id: 4,
          title: "Build Your First Website",
          description:
            "Apply your HTML, CSS, and JavaScript skills to create a complete website.",
          duration: "10 hours",
          difficulty:
            userPreferences.experience === "beginner"
              ? "Beginner"
              : "Intermediate",
          type: "Project",
          icon: "https://cdn-icons-png.flaticon.com/512/2821/2821005.png",
          completed: false,
        },
      ],
      milestones: [
        {
          week: 1,
          goal: "Complete HTML & CSS Fundamentals",
          completed: false,
        },
        {
          week: 2,
          goal: "Master JavaScript Basics",
          completed: false,
        },
        {
          week: 4,
          goal: "Build first React component",
          completed: false,
        },
        {
          week: 6,
          goal: "Deploy your first website",
          completed: false,
        },
      ],
    };

    console.log("🤖 Generated mock roadmap data");

    // Save or update the roadmap in database
    const { data: existingRoadmap, error: fetchError } = await supabase
      .from("learning_roadmaps")
      .select("*")
      .eq("user_id", userId)
      .single();

    let roadmapResponse;
    if (existingRoadmap) {
      // Update existing roadmap
      roadmapResponse = await supabase
        .from("learning_roadmaps")
        .update({
          roadmap_data: mockRoadmapData,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      // Create new roadmap
      roadmapResponse = await supabase.from("learning_roadmaps").insert({
        user_id: userId,
        roadmap_data: mockRoadmapData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    if (roadmapResponse.error) {
      console.error("Error saving roadmap:", roadmapResponse.error);
      return NextResponse.json(
        { error: "Failed to save roadmap" },
        { status: 500 }
      );
    }

    console.log("✅ Mock roadmap saved successfully");
    return NextResponse.json({ roadmap: mockRoadmapData });
  } catch (error) {
    console.error("💥 Error generating mock roadmap:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

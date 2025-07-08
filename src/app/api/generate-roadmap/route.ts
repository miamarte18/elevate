import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log("🚀 POST /api/generate-roadmap called");
  console.log("🔑 OpenAI API Key exists:", !!process.env.OPENAI_API_KEY);
  console.log("🔑 OpenAI API Key length:", process.env.OPENAI_API_KEY?.length);

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

    if (surveyError || !surveyData) {
      console.log("❌ Survey data not found");
      return NextResponse.json(
        { error: "Survey data not found" },
        { status: 404 }
      );
    }

    // Generate roadmap using OpenAI
    const prompt = `
    Based on the following user survey response, create a personalized learning roadmap for web development:

    Experience Level: ${surveyData.experience}
    Interests: ${surveyData.interests}
    Learning Style: ${surveyData.learning_style}
    Time Commitment: ${surveyData.time_commitment} hours per week
    Goal: ${surveyData.goal}

    Please create a comprehensive learning roadmap that includes:
    1. A brief personalized message for the user
    2. 4-6 learning resources/courses with titles, descriptions, and estimated completion times
    3. Progress tracking milestones
    4. Specific recommendations based on their learning style and time commitment

    Return the response in the following JSON format:
    {
      "personalizedMessage": "A motivational message tailored to their goals",
      "learningPath": "Web Development", 
      "progressPercentage": 0,
      "weeklyGoal": "Based on their time commitment",
      "resources": [
        {
          "id": 1,
          "title": "Resource Title",
          "description": "Brief description",
          "duration": "X hours",
          "difficulty": "Beginner/Intermediate/Advanced",
          "type": "Interactive/Video/Project/Reading",
          "icon": "Appropriate icon URL or description",
          "completed": false
        }
      ],
      "milestones": [
        {
          "week": 1,
          "goal": "Milestone description",
          "completed": false
        }
      ]
    }

    Make sure the recommendations are:
    - Appropriate for their experience level
    - Aligned with their interests and goals
    - Suited to their preferred learning style
    - Realistic for their time commitment
    - Include a mix of theoretical and practical content
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency, you can change to gpt-4 if needed
      messages: [
        {
          role: "system",
          content:
            "You are an expert learning advisor specializing in web development education. You create personalized learning roadmaps based on individual needs and preferences. Always respond with valid JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const roadmapContent = completion.choices[0].message.content;
    const roadmapData = JSON.parse(roadmapContent || "{}");

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
          roadmap_data: roadmapData,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId);
    } else {
      // Create new roadmap
      roadmapResponse = await supabase.from("learning_roadmaps").insert({
        user_id: userId,
        roadmap_data: roadmapData,
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

    return NextResponse.json({ roadmap: roadmapData });
  } catch (error) {
    console.error("💥 Error generating roadmap:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  console.log("🚀 GET /api/roadmap called");
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    console.log("📝 User ID:", userId);

    if (!userId) {
      console.log("❌ No user ID provided");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Fetching roadmap data...");
    // Fetch user's roadmap from database
    const { data: roadmapData, error: roadmapError } = await supabase
      .from("learning_roadmaps")
      .select("*")
      .eq("user_id", userId)
      .single();

    console.log("📊 Roadmap data:", roadmapData);
    console.log("❌ Roadmap error:", roadmapError);

    if (roadmapError || !roadmapData) {
      console.log("❌ Roadmap not found");
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    return NextResponse.json({ roadmap: roadmapData.roadmap_data });
  } catch (error) {
    console.error("💥 Error fetching roadmap:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId, resourceId, completed } = await request.json();

    if (!userId || resourceId === undefined) {
      return NextResponse.json(
        { error: "User ID and resource ID are required" },
        { status: 400 }
      );
    }

    // Get current roadmap
    const { data: roadmapData, error: fetchError } = await supabase
      .from("learning_roadmaps")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (fetchError || !roadmapData) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Update the specific resource completion status
    const updatedRoadmap = { ...roadmapData.roadmap_data };
    if (updatedRoadmap.resources && updatedRoadmap.resources[resourceId]) {
      updatedRoadmap.resources[resourceId].completed = completed;

      // Calculate new progress percentage
      const completedResources = updatedRoadmap.resources.filter(
        (r: any) => r.completed
      ).length;
      const totalResources = updatedRoadmap.resources.length;
      updatedRoadmap.progressPercentage = Math.round(
        (completedResources / totalResources) * 100
      );
    }

    // Save updated roadmap
    const { error: updateError } = await supabase
      .from("learning_roadmaps")
      .update({
        roadmap_data: updatedRoadmap,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update roadmap" },
        { status: 500 }
      );
    }

    return NextResponse.json({ roadmap: updatedRoadmap });
  } catch (error) {
    console.error("Error updating roadmap:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

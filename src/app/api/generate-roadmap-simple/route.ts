import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("🚀 POST /api/generate-roadmap-simple called");
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

    // Generate MOCK roadmap data - no database required
    const mockRoadmapData = {
      personalizedMessage: `Welcome to your personalized learning journey! As someone interested in web development, you're taking a great first step towards becoming a skilled developer. This roadmap is designed to guide you through the essential skills you'll need.`,
      learningPath: `Web Development`,
      progressPercentage: 0,
      weeklyGoal: `Study 4-7 hours per week focusing on building practical projects`,
      resources: [
        {
          id: 1,
          title: "HTML & CSS Fundamentals",
          description:
            "Learn the building blocks of web development with comprehensive HTML and CSS training.",
          duration: "8 hours",
          difficulty: "Beginner",
          type: "Interactive",
          icon: "https://cdn-icons-png.flaticon.com/512/732/732190.png",
          completed: false,
        },
        {
          id: 2,
          title: "JavaScript Basics",
          description:
            "Master the fundamentals of JavaScript programming with practical examples.",
          duration: "12 hours",
          difficulty: "Beginner",
          type: "Interactive",
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
          difficulty: "Beginner",
          type: "Project",
          icon: "https://cdn-icons-png.flaticon.com/512/2821/2821005.png",
          completed: false,
        },
        {
          id: 5,
          title: "Version Control with Git",
          description:
            "Learn Git and GitHub to manage your code and collaborate with others.",
          duration: "6 hours",
          difficulty: "Beginner",
          type: "Interactive",
          icon: "https://cdn-icons-png.flaticon.com/512/2111/2111288.png",
          completed: false,
        },
        {
          id: 6,
          title: "Deploy Your Website",
          description:
            "Learn how to deploy your projects to the web using modern hosting platforms.",
          duration: "4 hours",
          difficulty: "Intermediate",
          type: "Project",
          icon: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
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
        {
          week: 8,
          goal: "Complete all learning resources",
          completed: false,
        },
      ],
    };

    console.log("✅ Generated simple mock roadmap data");
    return NextResponse.json({ roadmap: mockRoadmapData });
  } catch (error) {
    console.error("💥 Error generating simple mock roadmap:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

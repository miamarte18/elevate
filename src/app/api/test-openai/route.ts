import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    console.log("🔑 Testing OpenAI API key...");
    console.log("🔑 API Key exists:", !!process.env.OPENAI_API_KEY);
    console.log("🔑 API Key length:", process.env.OPENAI_API_KEY?.length);

    // Simple test call to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "Say hello in JSON format with a message field.",
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 50,
    });

    console.log("✅ OpenAI API test successful");
    return NextResponse.json({
      success: true,
      message: "OpenAI API is working",
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("❌ OpenAI API test failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

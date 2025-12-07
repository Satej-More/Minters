import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const {
      subject,
      style,
      environment,
      genre,
      timePeriod,
      artMedium,
      mood,
      lighting,
      colorPalette,
      composition,
      customDetails,
    } = await req.json();

    // Use a valid model name
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert prompt writer for an AI image generation model.
      Your task is to generate a single paragraph, plain text prompt based on the following user-provided criteria.
      Do not use any bold, italic, or any other special formatting.
      The prompt should be descriptive, detailed, and evocative to help the AI generate a high-quality image.

      User Criteria:
      - Main Subject: ${subject || "not specified"}
      - Artistic Style: ${style || "not specified"}
      - Environment: ${environment || "not specified"}
      - Genre: ${genre || "not specified"}
      - Time Period: ${timePeriod || "not specified"}
      - Art Medium: ${artMedium || "not specified"}
      - Mood: ${mood || "not specified"}
      - Lighting: ${lighting || "not specified"}
      - Color Palette: ${colorPalette || "not specified"}
      - Composition: ${composition || "not specified"}
      - Additional Details: ${customDetails || "none"}

      Based on these criteria, generate a creative and detailed prompt.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, prompt: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message);

    // Fallback to Pollinations AI
    try {
      console.log("Falling back to Pollinations AI...");
      const { subject, style, mood, customDetails } = await req.json().catch(() => ({}));
      const fallbackPrompt = `Generate an image prompt for: ${subject || "a creative scene"}, style: ${style || "digital art"}, mood: ${mood || "neutral"}, details: ${customDetails || "none"}`;

      const response = await fetch(`https://text.pollinations.ai/${encodeURIComponent(fallbackPrompt)}`);
      if (response.ok) {
        const text = await response.text();
        return NextResponse.json({ success: true, prompt: text });
      }
    } catch (fallbackError) {
      console.error("Pollinations Fallback Error:", fallbackError);
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate prompt" },
      { status: 500 }
    );
  }
}

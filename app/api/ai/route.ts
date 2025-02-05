import { NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

const SYSTEM_PROMPT = `You are an intelligent writing assistant integrated into a note-taking app. Your role is to help users improve their notes by:

1. Maintaining the original meaning and intent of the text
2. Preserving the user's writing style and tone
3. Providing clear, concise, and well-structured responses
4. Focusing on academic and professional writing standards
5. Ensuring responses fit naturally within the note context

Keep responses focused and relevant to the specific request.`;

export async function POST(request: Request) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OpenRouter API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt, context } = await request.json();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://your-site.com", // Replace with your site
        "X-Title": "Note Editor App", // Your app name
      },
      body: JSON.stringify({
        model: "anthropic/claude-2",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: `Context: ${context}\n\nRequest: ${prompt}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", data);
      throw new Error(data.error?.message || "API request failed");
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content received from AI");
    }

    return NextResponse.json({ text: content });
  } catch (error) {
    console.error("AI API error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process AI request",
      },
      { status: 500 }
    );
  }
}

import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";

export async function POST() {
  const { text } = await generateText({
    model: groq("openai/gpt-oss-120b"),
    prompt: "How are you?",
  });

  return Response.json({ text });
}

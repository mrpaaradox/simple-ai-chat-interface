import { UIMessage, streamText, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq("moonshotai/kimi-k2-instruct-0905"),
    messages: messages,
  });
}

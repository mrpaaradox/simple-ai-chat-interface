import { UIMessage, streamText, convertToModelMessages } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("moonshotai/kimi-k2-instruct-0905"),
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant. Give real life examples so that user can understand better. Try to answer in 2-3 sentences. Unless the user asks for a specific topic, answer in a general way.",
        },
        ...(await convertToModelMessages(messages)),
      ],
    });

    result.usage.then((usage) => {
      console.log({
        messageCount: messages.length,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error(`Error in streaming response`, error);
    return new Response(`Failed to stream chat response`, { status: 500 });
  }
}

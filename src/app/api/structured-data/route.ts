import { streamObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { recipeSchema } from "./schema";


export async function POST(request: Request) {
    try {
        const { dish } = await request.json(); 

    const result = await streamObject({
        model: groq("openai/gpt-oss-20b"),
        schema: recipeSchema,
        prompt: `Generate a recipe for ${dish}`
    })

    return result.toTextStreamResponse()
    } catch (error) {
        console.log(`Error: ${error}`);
        return new Response("Failed to generate recipe", { status: 500 });
    }
}
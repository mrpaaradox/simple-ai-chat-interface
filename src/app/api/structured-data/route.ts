import { streamObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { recipeSchema } from "./schema";


export async function POST(request: Request) {
    try {
        const { dish } = await request.json(); 

    const result = await streamObject({
        model: groq("moonshotai/kimi-k2-instruct-0905"),
        schema: recipeSchema,
        prompt: `Generate a recipe for ${dish}`
    })

    return result.toTextStreamResponse()
    } catch (error) {
        console.log(`Error: ${error}`);
        return new Response("Failed to generate recipe", { status: 500 });
    }
}
import { tipsIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { redis } from "@/lib/db/redis";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Rate limiting configuration
const RATE_LIMIT_MAX_REQUESTS = 20; // Max requests per window
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60; // 1 hour window

// System prompt to restrict chatbot to Ontario university topics only
const SYSTEM_PROMPT = `You are an AI assistant for Project OU, a platform helping Ontario high school students with university admissions.

STRICT RULES - YOU MUST FOLLOW THESE:
1. ONLY answer questions related to:
   - Ontario university admissions and applications
   - OUAC (Ontario Universities' Application Centre)
   - Ontario high school Grade 11 and 12 academics
   - University programs in Ontario
   - Supplementary applications for Ontario universities
   - Scholarships at Ontario universities
   - Student life at Ontario universities
   - Course selection and prerequisites for Ontario universities
   - Admission averages and requirements
   - Application deadlines and timelines

2. For ANY question NOT related to the above topics, respond with:
   "I'm sorry, I can only help with questions about Ontario university admissions and related topics. Please ask me something about applying to universities in Ontario, admission requirements, programs, or student life!"

3. Do NOT:
   - Answer general knowledge questions
   - Help with homework or assignments unrelated to applications
   - Provide information about universities outside Ontario
   - Engage in casual conversation unrelated to Ontario admissions
   - Write essays, code, or creative content
   - Provide medical, legal, or financial advice

4. Be helpful, friendly, and encouraging to students navigating the admissions process.

5. If you're unsure whether a question is related to Ontario university admissions, err on the side of declining and redirect the user to ask an admissions-related question.`;

async function checkRateLimit(userId: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const key = `ratelimit:chat:${userId}`;
  
  try {
    const current = await redis.get(key);
    const count = current ? parseInt(current, 10) : 0;
    
    if (count >= RATE_LIMIT_MAX_REQUESTS) {
      const ttl = await redis.ttl(key);
      return { allowed: false, remaining: 0, resetIn: ttl > 0 ? ttl : RATE_LIMIT_WINDOW_SECONDS };
    }
    
    // Increment counter
    if (count === 0) {
      await redis.setex(key, RATE_LIMIT_WINDOW_SECONDS, "1");
    } else {
      await redis.incr(key);
    }
    
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - count - 1, resetIn: 0 };
  } catch (error) {
    // If Redis fails, allow the request but log the error
    console.error("Rate limit check failed:", error);
    return { allowed: true, remaining: -1, resetIn: 0 };
  }
}

export async function POST(req: Request) {
  try {
    // Get user ID from Clerk auth
    const { userId } = auth();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Please sign in to use the chatbot." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check rate limit
    const rateLimit = await checkRateLimit(userId);
    
    if (!rateLimit.allowed) {
      const minutes = Math.ceil(rateLimit.resetIn / 60);
      return new Response(
        JSON.stringify({ 
          error: `Rate limit exceeded. You can send ${RATE_LIMIT_MAX_REQUESTS} messages per hour. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.` 
        }),
        { 
          status: 429, 
          headers: { 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimit.resetIn.toString(),
          } 
        }
      );
    }

    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    // Get last 6 messages to get relevant chat context
    const messagesTruncated = messages.slice(-6);

    const relevantEmbedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );

    const pineconeMatches = await tipsIndex.query({
      topK: 3,
      vector: relevantEmbedding,
    });

    const relevantTips = await prisma.tip.findMany({
      where: {
        id: {
          in: pineconeMatches.matches.map((match) => match.id),
        },
      },
    });

    // Build context from relevant tips
    const tipsContext = relevantTips.length > 0
      ? "\n\nRelevant community tips that may help answer the question:\n" +
        relevantTips
          .map((tip) => `- ${tip.title}: ${tip.content}`)
          .join("\n")
      : "";

    const systemMessage = {
      role: "system" as const,
      content: SYSTEM_PROMPT + tipsContext,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini-2025-08-07",
      stream: true,
      messages: [systemMessage, ...messagesTruncated],
      max_tokens: 500, // Limit response length
      temperature: 0.7,
    });

    // Set up chat streaming
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream, {
      headers: {
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

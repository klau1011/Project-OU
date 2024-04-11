import { tipsIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { getEmbeddingForTip } from "@/utils/getEmbeddingForTip";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import {OpenAIStream, StreamingTextResponse} from 'ai'

export async function POST(req: Request) {
  const body = await req.json();

  const messages: ChatCompletionMessage[] = body.messages;

  // get last 6 messages to get relevant chat context
  const messagesTruncated = messages.slice(-6);

  const relevantEmbedding = await getEmbedding(
    messagesTruncated.map((message) => message.content).join("\n"),
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

  console.log("relevent tips found:", relevantTips);

  const systemMessage: ChatCompletionMessage = {
    role: "assistant",
    content:
      "You answer the user's question based on community submitted tips relating to Ontario universities and application processes, and grade 12. If the user does not talk about Ontario universities and applications, or grade 12, never give them an answer to avoid chatbot exploitation. " +
      "The relevant tips for the query are: \n" +
      relevantTips
        .map((tip) => `Tip title ${tip.title} \n\n Tip content: ${tip.content}`)
        .join("\n\n"),
  };

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true,
    messages: [systemMessage, ...messagesTruncated],
  });

  // set up chat streaming
  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
}

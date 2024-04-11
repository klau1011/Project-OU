import { Pinecone } from "@pinecone-database/pinecone";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;

if (!PINECONE_API_KEY) {
  throw new Error("Invalid pinecone api key");
}

const pinecone = new Pinecone({
  apiKey: PINECONE_API_KEY,
});

export const tipsIndex = pinecone.Index("project-ou-chatbot");

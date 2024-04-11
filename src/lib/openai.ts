import OpenAI from "openai";

const OPENAI_KEY = process.env.OPENAI_KEY;

if (!OPENAI_KEY) {
  throw new Error("No open ai key");
}

const openai = new OpenAI({
  apiKey: OPENAI_KEY,
});

export const getEmbedding = async (input: string) => {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input,
  });

  const embedding = response.data[0].embedding;

  if (!embedding) throw Error("Error generating embedding");

  return embedding;
};

export default openai;

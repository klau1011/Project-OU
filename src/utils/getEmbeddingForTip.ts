import { getEmbedding } from "@/lib/openai";

export const getEmbeddingForTip = async (title: string, content: string) => {
  const embedding = await getEmbedding(
    `title of tip: ${title} \n\n content of tip:${content}`,
  );

  return embedding
};

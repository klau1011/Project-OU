"use server";

import { tipsIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbeddingForTip } from "@/utils/getEmbeddingForTip";
import {
  CreateTipSchema,
  deleteTipSchema,
  updateTipSchema,
} from "@/validation/review";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const { userId } = auth();

const addTip = async ({ title, content, attachmentFile }: CreateTipSchema) => {
  if (!userId) {
    return Error("Not authorized");
  }

  const embedding = await getEmbeddingForTip(title, content);

  const tip = await prisma.$transaction(async (tx) => {
    const tip = await tx.tip.create({
      data: {
        title,
        content,
        userId,
        attachmentFileUrl: attachmentFile
      },
    });

    await tipsIndex.upsert([
      { id: tip.id, values: embedding, metadata: { userId } },
    ]);

    return tip;
  });

  revalidatePath("/tips");
  return tip;
};

const editTip = async ({
  id,
  title,
  content,
  attachmentFile
}: z.infer<typeof updateTipSchema>) => {
  if (!userId) {
    return Error("Not authorized");
  }

  const embedding = await getEmbeddingForTip(title, content);

  const tip = prisma.$transaction(async (tx) => {
    const tip = await tx.tip.update({
      where: { id },
      data: {
        title,
        content,
        userId,
        attachmentFileUrl: attachmentFile
      },
    });

    await tipsIndex.upsert([
      {
        id: id,
        values: embedding,
        metadata: { userId },
      },
    ]);

    return tip;
  });

  revalidatePath("/tips");
  return tip;
};

const deleteTip = async ({ id }: z.infer<typeof deleteTipSchema>) => {
  if (!userId) {
    return Error("Not authorized");
  }

  await prisma.$transaction(async (tx) => {
    await tx.tip.delete({
      where: { id },
    });

    await tipsIndex.deleteOne(id);
  });
  revalidatePath("/tips");
};

export { addTip, editTip, deleteTip };

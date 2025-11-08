"use server";

import { tipsIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbeddingForTip } from "@/utils/getEmbeddingForTip";
import {
  createTipSchema,
  deleteTipSchema,
  updateTipSchema,
  CreateTipSchema as CreateTipInputType,
} from "@/validation/review";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult<T> = { ok: true; data: T } | { ok: false; message: string };

export async function addTip(
  input: CreateTipInputType
): Promise<ActionResult<{ id: string }>> {
  const parse = createTipSchema.safeParse(input);
  if (!parse.success) return { ok: false, message: "Invalid payload" };

  const { userId } = auth();
  if (!userId) return { ok: false, message: "Not authorized" };

  const { title, content, attachmentFile } = parse.data;

  try {
    // create db row
    const tip = await prisma.tip.create({
      data: {
        title,
        content,
        userId,
        attachmentFileUrl: attachmentFile ?? null,
      },
      select: { id: true, title: true, content: true },
    });

    // calc + upsert embedding
    try {
      const embedding = await getEmbeddingForTip(tip.title, tip.content);
      await tipsIndex.upsert([
        { id: tip.id, values: embedding, metadata: { userId } },
      ]);
    } catch (e) {
      console.error("Pinecone upsert failed:", e);
    }

    revalidatePath("/tips");
    return { ok: true, data: { id: tip.id } };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Failed to create tip" };
  }
}

export async function editTip(
  input: z.infer<typeof updateTipSchema>
): Promise<ActionResult<void>> {
  const parse = updateTipSchema.safeParse(input);
  if (!parse.success) return { ok: false, message: "Invalid payload" };

  const { userId } = auth();
  if (!userId) return { ok: false, message: "Not authorized" };

  const { id, title, content, attachmentFile } = parse.data;

  const existing = await prisma.tip.findUnique({
    where: { id },
    select: { userId: true, title: true, content: true },
  });
  if (!existing) return { ok: false, message: "Not found" };
  if (existing.userId !== userId) return { ok: false, message: "Forbidden" };

  try {
    await prisma.tip.update({
      where: { id, userId },
      data: {
        title,
        content,
        ...(attachmentFile !== undefined
          ? { attachmentFileUrl: attachmentFile }
          : {}),
      },
    });

    if (existing.title !== title || existing.content !== content) {
      try {
        const embedding = await getEmbeddingForTip(title, content);
        await tipsIndex.upsert([
          { id, values: embedding, metadata: { userId } },
        ]);
      } catch (e) {
        console.error("Pinecone upsert (edit) failed:", e);
      }
    }

    revalidatePath("/tips");
    return { ok: true, data: undefined };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Failed to update tip" };
  }
}

export async function deleteTip(
  input: z.infer<typeof deleteTipSchema>
): Promise<ActionResult<void>> {
  const parse = deleteTipSchema.safeParse(input);
  if (!parse.success) return { ok: false, message: "Invalid payload" };

  const { userId } = auth();
  if (!userId) return { ok: false, message: "Not authorized" };

  const { id } = parse.data;

  const existing = await prisma.tip.findUnique({
    where: { id },
    select: { userId: true },
  });
  if (!existing) return { ok: false, message: "Not found" };
  if (existing.userId !== userId) return { ok: false, message: "Forbidden" };

  try {
    await prisma.tip.delete({ where: { id, userId } });

    try {
      await tipsIndex.deleteOne(id);
    } catch (e) {
      console.error("Pinecone delete failed:", e);
    }

    revalidatePath("/tips");
    return { ok: true, data: undefined };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Failed to delete tip" };
  }
}

"use server";

import s3 from "@/lib/db/s3";
import crypto from "node:crypto";
import path from "node:path";

const { s3Client, PutObjectCommand } = s3();

export async function uploadFile(userId: string, formData: FormData) {
  if (!userId) throw new Error("Not authorized");

  const file = formData.get("attachmentFile") as File | null;
  if (!file) return undefined;

  const arrayBuf = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);

  const ext = path.extname(file.name) || ".bin";
  const key = `${userId}/${crypto.randomUUID()}${ext}`;

  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: file.type || "application/octet-stream",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  const endpoint = process.env.AWS_S3_PUBLIC_BASE_URL; 

  return endpoint ? `${endpoint}/${encodeURI(key)}` : key; 
}

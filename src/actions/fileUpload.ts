"use server";

import s3 from "@/lib/db/s3";

const { s3Client, PutObjectCommand } = s3();
export async function uploadFile(userId: string, formData: FormData) {
  const attachmentFile = formData.get("attachmentFile") as File;

const buffer = Buffer.from(await attachmentFile.arrayBuffer());

  const params = {
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
    Key: `${userId}/${attachmentFile.name}`,
    Body: buffer,
  };
  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);

    return `${
      process.env.AWS_S3_ENDPOINT
    }/${userId}/${attachmentFile.name.replaceAll(" ", "+")}`;
  } catch (error) {
    console.log(error);
  }
}

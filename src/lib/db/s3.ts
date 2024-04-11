import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export default function () {
  const accessKeyId = process.env.NEXT_AWS_S3_ACCESS_KEY_ID;
  if (!accessKeyId) {
    console.log("No NEXT_AWS_S3_ACCESS_KEY_ID found");
  }

  const secretAccessKey = process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY;
  if (!secretAccessKey) {
    console.log("No NEXT_AWS_S3_SECRET_ACCESS_KEY found");
  }
  const s3Client = new S3Client({
    region: process.env.NEXT_AWS_S3_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID ?? "",
      secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY ?? "",
    },
  });

  return { s3Client, PutObjectCommand };
}

import { NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // Replace with your AWS Access Key ID
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // Replace with your AWS Secret Access Key
  region: process.env.AWS_REGION, // Replace with your AWS Region (e.g., 'ap-south-1')
});

export async function GET() {
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    return NextResponse.json({ error: "Bucket name is not configured" }, { status: 500 });
  }

  try {
    // List all objects in the bucket
    const result = await s3
      .listObjectsV2({
        Bucket: bucketName,
      })
      .promise();

    // Generate pre-signed URLs for all video objects
    const videoObjects = result.Contents?.map((object) => {
      const params = {
        Bucket: bucketName,
        Key: object.Key!,
        Expires: 3600, // URL valid for 1 hour
      };

      const url = s3.getSignedUrl("getObject", params);
      return {
        key: object.Key,
        url,
      };
    });

    return NextResponse.json(videoObjects || [], { status: 200 });
  } catch (error) {
    console.error("Error listing videos:", error);
    return NextResponse.json({ error: "Error listing videos" }, { status: 500 });
  }
}

require("dotenv").config();
const { S3Client, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");

// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3Client;

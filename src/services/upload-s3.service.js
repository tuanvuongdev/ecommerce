"use strict";

const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const randomImageName = () => crypto.randomUUID();

const uploadImageFromLocalS3 = async ({ file }) => {
  const imageName = randomImageName();

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName, //file name
    Body: file.buffer,
    ContentType: "image/jpeg",
  });

  // export url
  await s3.send(command);

  const signedUrl = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName,
  });
  const url = await getSignedUrl(s3, signedUrl, { expiresIn: 3600 });

  return url;
};

module.exports = {
  uploadImageFromLocalS3,
};

"use strict";

const cloudinary = require("../configs/cloudinary.config");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const urlImagePublic = 'https://d2wkb06js4mumm.cloudfront.net'

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
  const result = await s3.send(command);

  // const signedUrl = new GetObjectCommand({
  //   Bucket: process.env.AWS_BUCKET_NAME,
  //   Key: imageName,
  // });
  // const url = await getSignedUrl(s3, signedUrl, { expiresIn: 36000 });

  const signedUrl = getSignedUrl({
    url: `${urlImagePublic}/${imageName}`,
    keyPairId: process.env.AWS_KEY_PAIR_ID,
    dateLessThan: new Date(Date.now() + 1000 * 60), // 1 minute expires
    privateKey: process.env.AWS_PRIVATE_KEY,
  });

  return {
    url: signedUrl,
    result
  };
};

module.exports = {
  uploadImageFromLocalS3,
};

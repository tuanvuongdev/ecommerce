"use strict";

const cloudinary = require("../configs/cloudinary.config");

// upload file use cloudinary
// 1. upload from url image
const uploadImageFromUrl = async () => {
  const urlImage =
    "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lm4q72bu0b8f8c_tn";
  const folderName = "product/8409",
    newFileName = "testdemo"; //foldName on cloudinary

  const result = await cloudinary.uploader.upload(urlImage, {
    folder: folderName,
    public_id: newFileName,
  });

  return result;
};

// 2. upload from local image
const uploadImageFromLocal = async ({ path, folderName = "product/8049" }) => {
  const result = await cloudinary.uploader.upload(path, {
    folder: folderName,
    public_id: "thumbnail",
  });

  return {
    image_url: result.secure_url,
    shopId: 8409,
    thumb_url: await cloudinary.url(result.public_id, {
      width: 100,
      height: 100,
      crop: "fill",
      //   format: "jpg",
    }),
  };
};

// 2. upload from local image
const uploadImageFromLocalMulti = async ({
  files,
  folderName = "product/8049",
}) => {
  const uploadPromises = files.map((file) => {
    return cloudinary.uploader.upload(file.path, {
      folder: folderName,
      //   public_id: "thumbnail",
    });
  });

  const result = await Promise.all(uploadPromises);

  const thumbUrls = await Promise.all(
    result.map((item) => {
      return cloudinary.url(item.public_id, {
        width: 100,
        height: 100,
        // crop: "fill",
        format: "jpg",
      });
    })
  );

  return result.map((item, index) => {
    return {
      image_url: item.secure_url,
      shopId: 8409,
      thumb_url: thumbUrls[index],
    };
  });
};

module.exports = {
  uploadImageFromUrl,
  uploadImageFromLocal,
  uploadImageFromLocalMulti,
};

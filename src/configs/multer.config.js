"use strict";

const multer = require("multer");

const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/uploads/");
    },
    filename: function (req, file, cb) {
      const fileName = Date.now() + "-" + file.originalname;
      cb(null, fileName);
    },
  }),
});

module.exports = {
  uploadDisk,
  uploadMemory,
};

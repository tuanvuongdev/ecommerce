const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const UploadService = require("../services/upload-cloudinary.service");

class UploadCloudinaryController {
  uploadImage = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload image success",
      metadata: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumbnail = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError("File is missing");

    new SuccessResponse({
      message: "Upload image success",
      metadata: await UploadService.uploadImageFromLocal({
        path: file.path,
        folderName: req.body.folderName,
      }),
    }).send(res);
  };

  uploadFileThumbnailMulti = async (req, res, next) => {
    const { files } = req;
    if (!files.length) throw new BadRequestError("File is missing");

    new SuccessResponse({
      message: "Upload image success",
      metadata: await UploadService.uploadImageFromLocalMulti({
        files,
      }),
    }).send(res);
  };
}

module.exports = new UploadCloudinaryController();

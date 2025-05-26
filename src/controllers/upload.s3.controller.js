const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const UploadService = require("../services/upload-s3.service");

class UploadS3Controller {
  uploadImageFromLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) throw new BadRequestError("File is missing");

    new SuccessResponse({
      message: "Upload image success",
      metadata: await UploadService.uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadS3Controller();

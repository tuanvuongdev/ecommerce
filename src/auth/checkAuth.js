"use strict";

const { ForbiddenError, PermissionError } = require("../core/error.response");
const { findById } = require("../services/apikey.service");
const { HEADER } = require("../utils");

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    next(new ForbiddenError());
  }

  // check objKey
  const objKey = await findById(key);
  if (!objKey) {
    next(new ForbiddenError());
  }
  req.objKey = objKey;
  return next();
};

const permission = (permission) => {
  // trình bao đóng, trả về 1 hàm mà hàm đó có thể sử dụng các biến của thằng cha
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      next(new PermissionError("Permission denied"));
    }

    console.log("permissions::", req.objKey.permissions);
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      next(new PermissionError("Permission denied"));
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};

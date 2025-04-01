"use strict";

const { Schema, model, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

// Declare the Schema of the Mongo model
var discountSchema = new Schema(
  {
    discount_name: { type: String, required: true },
    discount_description: { type: String, required: true },
    discount_type: { type: String, default: "fixed_amount" }, // percentage
    discount_value: { type: Number, required: true }, // 10.000 || 10 %
    discount_maxValue: { type: Number, required: true }, // 10.000 || 10 %
    discount_code: { type: String, required: true }, // discount code
    discount_startDate: { type: Date, required: true }, // ngay bat dau
    discount_endDate: { type: Date, required: true }, // ngay ket thuc
    discount_maxUses: { type: Number, required: true }, // so luong discount duoc ap dung
    discount_usesCount: { type: Number, required: true }, // so luong discount da duoc su dung
    discount_usersUsed: { type: Array, default: [] }, // ai da su dung
    discount_maxUsesPerUser: { type: Number, required: true }, // so luong discount toi da moi nguoi duoc su dung
    discount_minOrderValue: { type: Number, required: true }, // gia tri don hang toi thieu de duoc ap dung
    discount_shopId: { type: Types.ObjectId, ref: "Shop" },

    discount_isActive: { type: Boolean, default: true },
    discount_appliesTo: {
      type: String,
      default: "all",
      enum: ["all", "specific"],
    },
    discount_productIds: { type: Array, default: [] }, // so san pham duoc ap dung
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = {
  discount: model(DOCUMENT_NAME, discountSchema),
};

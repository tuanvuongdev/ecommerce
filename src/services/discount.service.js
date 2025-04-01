"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");

/*
    Discount services
    1 - Generate Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount Code [Admin | Shop]
    6 - Cancel discount code [User]
*/

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      shopId,
      code,
      startDate,
      endDate,
      isActive,
      minOrderValue,
      productIds,
      appliesTo,
      name,
      description,
      type,
      value,
      maxValue,
      maxUses,
      usesCount,
      maxUsesPerUser,
      usersUsed,
    } = payload;

    // kiem tra
    // if (new Date() < new Date(startDate) || new Date() > new Date(endDate)) {
    //   throw new BadRequestError(
    //     "Discount start date must be greater than the current date"
    //   );
    // }

    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestError(
        "Discount start date must be less than the end date"
      );
    }

    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: shopId,
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_isActive) {
      throw new BadRequestError("Discount code already exists");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_minOrderValue: minOrderValue,
      discount_maxValue: maxValue,
      discount_startDate: new Date(startDate),
      discount_endDate: new Date(endDate),
      discount_maxUses: maxUses,
      discount_usesCount: usesCount,
      discount_usersUsed: usersUsed,
      discount_shopId: shopId,
      discount_maxUsesPerUser: maxUsesPerUser,
      discount_isActive: isActive,
      discount_appliesTo: appliesTo,
      discount_productIds: appliesTo === "all" ? [] : productIds,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    //...
  }

  /*
    Get all discount codes available with products for user
  */
  static async getAllDiscountCodesWithProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    // create index for discount_code
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    });

    if (!foundDiscount || !foundDiscount.discount_isActive)
      throw new BadRequestError("Discount not exists!");

    const { discount_appliesTo, discount_productIds } = foundDiscount;

    let products;
    if (discount_appliesTo === "all") {
      // get all products
      products = await findAllProducts({
        filter: {
          product_shop: shopId,
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_appliesTo === "specific") {
      // get the product by ids
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_productIds },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  /*
    Get all discount codes for shop
  */
  static async getAllDiscountCodesByShop({ limit, page, shopId }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: shopId,
        discount_isActive: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });

    return discounts;
  }

  /*
    Apply discount code
    - Tính tiền giá của toàn bộ sản phẩm được áp dụng code, nếu hợp lệ thì sẽ trả về số tiền được discount
  */
  static async getDiscountAmount({ code, userId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: code,
        discount_shopId: shopId,
      },
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`);

    const {
      discount_isActive,
      discount_maxUses,
      discount_startDate,
      discount_endDate,
      discount_minOrderValue,
      discount_usersUsed,
      discount_maxUsesPerUser,
      discount_type,
      discount_value,
      discount_maxValue
    } = foundDiscount;

    if (!discount_isActive) throw new NotFoundError(`Discount expired`);
    if (!discount_maxUses) throw new NotFoundError(`Discount are out of uses`);

    if (
      new Date() < new Date(discount_startDate) ||
      new Date() > new Date(discount_endDate)
    )
      throw new NotFoundError(`Discount ecode has expired`);

    let totalOrder = 0;
    if (discount_minOrderValue > 0) {
      // get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_minOrderValue)
        throw new BadRequestError(
          `Discount requires a minimum of ${discount_minOrderValue}!`
        );
    }

    if (discount_maxUsesPerUser > 0) {
      const countUserUsedDiscount = discount_usersUsed.filter(
        (user) => user.userId === userId
      ).length;
      if (countUserUsedDiscount > discount_maxUsesPerUser)
        throw new BadRequestError(
          `Discount only be used for ${discount_maxUsesPerUser} times!`
        );
    }

    // check xem discount nay la fixed_amount || percentage
    let amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    if (amount > discount_maxValue) amount = discount_maxValue;

    let total = totalOrder - amount > 0 ? totalOrder - amount : 0;

    return {
      totalOrder,
      discount: amount,
      totalPrice: total,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    // check xem discount nay co ton tai hay khong, neu ton tai moi cho xoa

    // Kiem tra xem discount nay dang duoc dung o dau khong

    // Kiem tra nguoi dung co được phép xóa discount code nay hay không (check xem discount nay có phải thuộc về shopId)

    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: shopId,
    });

    return deleted;
  }

  /*
    cancel discount code
  */
  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundDiscount = await checkDiscountExists({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: shopId,
      },
    });

    if (!foundDiscount) throw new NotFoundError(`Discount doesn't exist`);

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_usersUsed: userId,
      },
      $inc: {
        discount_maxUses: 1,
        discount_usesCount: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;

"use strict";

const { BadRequestError } = require("../core/error.response");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");

class CheckoutService {
  // login and without login

  /*
        {
            cartId,
            userId,
            shopOrderIds: [
                {
                    shopId,
                    shopDiscounts: [],
                    itemProducts: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                },
                {
                    shopId,
                    shopDiscounts: [
                        {
                            shopId,
                            discountId,
                            codeId
                        }
                    ],
                    itemProducts: [
                        {
                            price,
                            quantity,
                            productId
                        }
                    ]
                }
            ]
        }
    */
  static async checkoutReview({ userId, cartId, shopOrderIds = [] }) {
    // check cartId ton tai khong?
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new BadRequestError("Cart does not exist!");

    const checkoutOrder = {
        totalPrice: 0, // tong tien hang
        feeShip: 0,
        totalDiscount: 0, // tong tien discount
        totalCheckout: 0,
      },
      shopOrderIdsNew = [];

    // tinh tong tien bill
    for (let i = 0; i < shopOrderIds.length; i++) {
      const { shopId, shopDiscounts = [], itemProducts = [] } = shopOrderIds[i];
      // check product avilable
      const checkProductServer = await checkProductByServer(itemProducts);
      if (!checkProductServer[0]) throw new BadRequestError("Order wrong!!!");

      // tong tien don hang
      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      // tong tien truoc khi xu ly
      checkoutOrder.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shopDiscounts,
        priceRaw: checkoutPrice, // tien truoc khi giam gia
        priceApplyDiscount: checkoutPrice,
        itemProducts: checkProductServer,
      };

      // neu shopDiscounts ton tai > 0, check xem co hop le hay khong
      if (shopDiscounts.length > 0) {
        // gia su chi co mot discount
        // get amount discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeId: shopDiscounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        // tong cong discount giam gia
        checkoutOrder.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      shopOrderIdsNew.push(itemCheckout);
    }

    return {
      shopOrderIds,
      shopOrderIdsNew,
      checkoutOrder,
    };
  }
}

module.exports = CheckoutService;

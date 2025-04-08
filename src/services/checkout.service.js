"use strict";

const { BadRequestError } = require("../core/error.response");
const { order } = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

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
        return acc + (product.quantity * product.price);
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
          code: shopDiscounts[0].codeId,
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

  //order
  static async orderByUser({
    shopOrderIds,
    cartId,
    userId,
    userAddress = {},
    userPayment = {}
  }) {
    const { shopOrderIdsNew, checkoutOrder } = await this.checkoutReview({ userId, cartId, shopOrderIds })

    // check lai mot lan nua xem vuot ton kho hay khong
    // get new array Products
    const products = shopOrderIdsNew.flatMap(order => order.itemProducts)

    const acquireProduct = []

    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i]

      const keyLock = await acquireLock(productId, quantity, cartId)
      acquireProduct.push(!!keyLock)
      if (keyLock) {
        await releaseLock(keyLock)
      }
    }

    // check co 1 san pham het hang trong kho
    if (acquireProduct.includes(false)) {
      throw new BadRequestError("Some products have been out of stock")
    }

    const newOrder = await order.create({
      order_userId: userId,
      order_checkout: checkoutOrder,
      order_shipping: userAddress,
      order_payment: userPayment,
      order_products: shopOrderIdsNew
    })

    // truong hop: neu insert thanh cong, thi remove product co trong cart
    if (newOrder) {

    }

    return newOrder;
  }
}

module.exports = CheckoutService;

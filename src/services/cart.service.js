"use strict";

const { NotFoundError } = require("../core/error.response");
const { cart } = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
} = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");

/**
    Key features: Cart Service
    - add product to cart [User]
    - reduce product quantity by one [User]
    - increase product quantity by one [User]
    - get cart [User]
    - delete cart [User]
    - delete cart item [User]
 */

class CartService {
  static async addToCart({ userId, product = {} }) {
    // check cart exists
    const userCart = await cart.findOne({ cart_userId: userId });
    if (!userCart) {
      // create new cart
      return await createUserCart({ userId, product });
    }

    // neu co cart rồi nhưng chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    // gio hang ton tai, va co san pham nay thi update quantity
    return await updateUserCartQuantity({ userId, product });
  }

  // update cart
  /*
    shop_order_ids: [
      {
        shopId,
        item_products: [
          {
            quantity,
            price,
            shopId,
            old_quantity,
            productId
          }
        ],
        version // khoa bi quan, khoa lac quan va khoa phan tan
      }
    ]
  */
  static async addToCartV2({ userId, shopOrderIds }) {
    const { productId, quantity, oldQuantity } =
      shopOrderIds[0]?.itemProduct[0];

    // check product
    const foundProduct = await getProductById(productId);

    if (!foundProduct) throw new NotFoundError("Product not found");
    // compare
    if (foundProduct.product_shop.toString() !== shopOrderIds[0]?.shopId) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
      // deleted
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteUserCart({ userId, productId }) {
    const query = { cart_userId: userId, cart_state: "active" },
      updateSet = {
        $pull: {
          cart_products: {
            productId,
          },
        },
      };

    const deleteCart = await cart.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart({ userId }) {
    return await cart.findOne({ cart_userId: +userId }).lean();
  }
}

module.exports = CartService;

"use strict";

const { cart } = require("../models/cart.model");
const { createUserCart } = require("../models/repositories/cart.repo");

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
  }
}

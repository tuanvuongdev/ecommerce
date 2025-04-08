const { SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  /**
   * @description add to cart for user
   * @param {int} userId
   * @param {*} res
   * @param {*} next
   * @method POST
   * @url /v1/api/cart/user
   * @return {
   * }
   */
  checkoutReview = async (req, res, next) => {
    // new
    new SuccessResponse({
      message: "Response checkout success",
      metadata: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();

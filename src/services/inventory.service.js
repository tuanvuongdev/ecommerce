'use strict'

const { BadRequestError } = require("../core/error.response");
const { getProductById } = require("../models/repositories/product.repo")

class InventoryService {

    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'unKnow',
    }) {
        const product = await getProductById(productId);
        if (!product) throw new BadRequestError('The product does not exists');

        const query = { invent_shopId: shopId, invent_productId: productId },
            updateSet = {
                $inc: {
                    invent_stock: stock
                },
                $set: {
                    invent_location: location
                }
            }, options = { upsert: true, new: true };

        return await inventory.findOneAndUpdate(query, updateSet, options);
    }
}

module.exports = InventoryService;
'use strict'

const { inventory } = require("../inventory.model")

const insertInventory = async ({ productId, shopId, stock, location = 'unKnow', }) => {
    return await inventory.create({
        invent_productId: productId,
        invent_location: location,
        invent_stock: stock,
        invent_shopId: shopId
    });
}

module.exports = {
    insertInventory
}
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

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        invent_productId: productId,
        invent_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            invent_stock: -quantity
        },
        $push: {
            invent_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true };

    return await inventory.updateOne(query, updateSet, options);
}

module.exports = {
    insertInventory,
    reservationInventory
}
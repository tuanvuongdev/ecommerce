"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

// Declare the Schema of the Mongo model
const orderSchema = new Schema(
    {
        order_userId: { type: Number, required: true },
        order_checkout: { type: Object, default: {} },
        /*
            order_checkout = {
                totalPrice,
                totalApllyDiscount,
                feeShip
            }
        */
        order_shipping: { type: Object, default: {} },
        /*
             order_shipping = {
                 street,
                 city,
                 state,
                 country
            }
        */
        order_products: { type: String, required: true },
        order_trackingNumber: { type: String, default: '#0000118052025' },
        order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'canceled', 'delivered'], default: 'pending' },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createdAt: "createdOn",
            updatedAt: "modifiedOn",
        },
    }
);

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, orderSchema),
};

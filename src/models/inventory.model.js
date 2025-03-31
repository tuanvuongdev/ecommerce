'use strict'

const { Schema, model, Types } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
var inventorySchema = new Schema({
    invent_productId: { type: Types.ObjectId, ref: 'Product' },
    invent_location: { type: String, default: 'unKnow' },
    invent_stock: { type: Number, required: true },
    invent_shopId: { type: Types.ObjectId, ref: 'Shop' },
    invent_reservations: { type: Array, default: [] },
    /*
        cartId,
        stock: 1,
        createAt
    */
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, inventorySchema)
};
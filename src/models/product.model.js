'use strict'


const { Schema, model } = require('mongoose'); // Erase if already required
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';
// Declare the Schema of the Mongo model
var productSchema = new Schema({
    product_name: { type: String, required: true, },
    product_thumb: { type: String, required: true, },
    product_description: String,
    product_slug: String, // quan-jean-cap-cap
    product_price: { type: Number, required: true, },
    product_quantity: { type: Number, required: true, },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Furniture', 'Clothing'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop', },
    product_attributes: { type: Schema.Types.Mixed, required: true, },
    // more
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating must be at most 5'],
        // 4.33335 -> 4.3
        set: val => Math.round(val * 10) / 10,
    },
    product_variations: {
        type: Array,
        default: [],
    },
    // nhung bien khong select ra thi khong nen co prefix product
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

// Document middleware: runs before .save() and .create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
})

// define the product type = clothing
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
}, {
    collection: 'clothes',
    timestamps: true
});

// define the product type = clothing
const electronicSchema = new Schema({
    manufacturer: {
        type: String,
        required: true,
    },
    model: String,
    color: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
}, {
    collection: 'electronics',
    timestamps: true
});

// define the product type = clothing
const furnitureSchema = new Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    }
}, {
    collection: 'furnitures',
    timestamps: true
});

//Export the model
module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema),
}
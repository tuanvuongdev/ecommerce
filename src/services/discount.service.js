'use strict'

const { BadRequestError } = require("../core/error.response");
const { discount } = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");

/*
    Discount services
    1 - Generate Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount Code [Admin | Shop]
    6 - Cancel discount code [User]
*/

class DiscountService {

    static async creatDiscountCode(payload) {
        const {
            code, startDate, endDate, isActive, shopId, minOrderValue, productIds, appliesTo, name,
            description, type, value, maxValue, maxUses, usesCount, maxUsesPerUser, usersUsed
        } = payload;

        // kiem tra
        if (new Date < new Date(startDate) || new Date > new Date(endDate)) {
            throw new BadRequestError('Discount start date must be greater than the current date');
        }

        if (new Date(startDate) >= new Date(endDate)) {
            throw new BadRequestError('Discount start date must be less than the end date');
        }

        // create index for discount code
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId)
        }).lean();

        if (foundDiscount && foundDiscount.discount_isActive) {
            throw new BadRequestError('Discount code already exists');
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_minOrderValue: minOrderValue,
            discount_maxValue: maxValue,
            discount_startDate: new Date(startDate),
            discount_endDate: new Date(endDate),
            discount_maxUses: maxUses,
            discount_usesCount: usesCount,
            discount_usersUsed: usersUsed,
            discount_shopId: convertToObjectIdMongodb(shopId),
            discount_maxUsesPerUser: maxUsesPerUser,
            discount_isActive: isActive,
            discount_appliesTo: appliesTo,
            discount_productIds: appliesTo === 'all' ? [] : productIds,
        });

        return newDiscount;
    }
}
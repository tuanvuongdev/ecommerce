'use strict'

const _ = require('lodash');
const { Types } = require('mongoose');

const convertToObjectIdMongodb = id => Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields);
}

// ['a', 'b'] => { a: 1, b: 1 }
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 1]));
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(item => [item, 0]));
}

const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] === null) {
            delete obj[key];
        }
    })

    return obj
}


/**
 * const a = {
 *     c: {
 *          d: 1,
 *          e: 2 
 *      }
 * }
 * 
 * => db.collection.updateOne({
 *      `c.d`: 1,
 *      `c.e`: 2
 * })
 */
const updateNestedObjectParser = obj => {
    const final = {};
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response).forEach(a => {
                final[`${key}.${a}`] = response[a];
            });
        } else {
            final[key] = obj[key];
        }
    })

    return final;
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParser,
    convertToObjectIdMongodb
}
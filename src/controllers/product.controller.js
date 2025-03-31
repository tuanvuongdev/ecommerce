'use strict'

const { SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId
                }
            )
        }).send(res);
    }

    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update new Product success!',
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId
                })
        }).send(res);
    }

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product success!',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Unpublish Product success!',
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            })
        }).send(res);
    }
    // QUERY //

    /**
     * @desc Get all Drafts for shop
     * @param { Number } limit
     * @param { Number } skip
     * @return { JSON }
     */
    getAllDraftsForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success!',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    /**
     * @desc Get all Drafts for shop
     * @param { Number } limit
     * @param { Number } skip
     * @return { JSON }
     */
    getAllPublishForShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success!',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId,
            })
        }).send(res);
    }

    getListSearchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list search product success!',
            metadata: await ProductService.searchProducts(req.params)
        }).send(res);
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all product success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res);
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list all product success!',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id
            })
        }).send(res);
    }
    // END QUERY

}

module.exports = new ProductController();
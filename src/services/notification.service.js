'use strict'

const notificationModel = require("../models/notification.model")

const pushNotiToSystem = async ({
    type = 'SHOP-001',
    senderId = 1,
    receiverId = 1,
    options = {}
}) => {
    let noti_content

    if (type === 'ORDER-001') {
        noti_content = `Order successfully`
    } else if (type === 'ORDER-002') {
        noti_content = `Order failed`
    } else if (type === 'PROMOTION-001') {
        noti_content = `@@@ vừa mới thêm một voucher: @@@@@@`
    } else if (type === 'SHOP-001') {
        noti_content = `@@@ vừa mới thêm một sản phẩm: @@@@`
    }

    const newNoti = await notificationModel.create({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_content,
        noti_options: options
    })
    return newNoti
}

const listNotiByUser = async ({
    userId = 1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = {
        noti_receiverId: userId
    }

    if (type !== 'ALL') {
        match.noti_type = type
    }

    return await notificationModel.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr: ['$noti_options.shop_name', 0, -1]
                        },
                        'vừa mới thêm một sản phẩm mới: ',
                        {
                            $substr: ['$noti_options.product_name', 0, -1]
                        }
                    ]
                },
                createAt: 1,
                noti_options: 1
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}
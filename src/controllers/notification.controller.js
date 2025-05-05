const { SuccessResponse } = require("../core/success.response");
const { listNotiByUser } = require("../services/notification.service");

class NotificationController {

    getListNotifications = async (req, res, next) => {
        new SuccessResponse({
            message: "Get list notifications by user success",
            metadata: await listNotiByUser(req.body),
        }).send(res);
    };

}

module.exports = new NotificationController();

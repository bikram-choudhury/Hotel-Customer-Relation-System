const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const schema = require('../schemas/cart.schema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const OrderStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
};

router.use(async (request, response, next) => {
    const authToken = request.header('Authorization');
    try {
        if (authToken) {
            const [type, token] = authToken.split(' ');
            if (type === 'Bearer') {
                const decodedToken = await AuthController.verifyToken(token);
                const user = {
                    userId: decodedToken._id
                };
                request.user = user;
                next();
            } else {
                const message = 'Error in authorization format';
                response.status(401).json({ message });
            }
        } else {
            const message = 'Authorization is not provided in header';
            response.status(401).json({ message });
        }
    } catch (error) {
        response.status(401).send(error);
    }
});

router.post('/', async (request, response) => {
    const userId = request.user.userId;
    const itemsToSave = request.body || [];
    if (Object.prototype.toString.call(itemsToSave) === '[object Array]') {
        const itemsWithUserId = {
            userId,
            items: itemsToSave,
            status: OrderStatus.PENDING
        };
        const cart = new schema(itemsWithUserId);
        try {
            const savedOrder = await cart.save();
            response.json({ orderId: savedOrder._id });
        } catch (error) {
            response.status(400).send(error);
        }
    }
});
router.get('/', async (request, response) => {
    const userId = request.user.userId;
    try {
        const orders = await schema.aggregate([
            {
                "$match": { userId }
            }, {
                "$sort": { "createdAt": 1 }
            }, {
                "$unwind": "$items"
            }, {
                "$addFields": { "itemObjId": { "$toObjectId": "$items.itemId" } }
                // convert string itemId to ObjectId to match
            }, {
                "$lookup": {
                    "from": "items",
                    "localField": "itemObjId",
                    "foreignField": "_id",
                    "as": "itemInfo"
                }
            }, {
                "$unwind": "$itemInfo"
            }, {
                "$addFields": {
                    "itemDetails.name": "$itemInfo.name",
                    "itemDetails.price": "$itemInfo.price",
                    "itemDetails.qty": "$items.qty",
                }
            }, {
                "$project": {
                    "_id": 1,
                    "itemDetails": 1,
                    "createdAt": 1,
                    "createdDate": { "$dateToString": { "format": "%Y-%m-%d", "date": "$createdAt" } },
                    "status": 1
                }
            }, {
                "$group": {
                    "_id": "$_id",
                    "itemsInCart": {
                        "$push": "$itemDetails"
                    },
                    "status": { "$first": "$status" },
                    "createdAt": { "$first": "$createdAt" },
                    "createdDate": { "$first": "$createdDate" }
                }
            }
        ]);
        response.json(orders);
    } catch (error) {
        response.status(500).json(error);
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const schema = require('../schemas/items.schema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.route('/:itemId?')
    .get((request, response) => {
        const itemId = request.params && request.params.itemId || '';
        const conditions = { isActive: true };
        if (itemId) {
            conditions = {
                _id: ObjectId(itemId)
            };
        }
        const fetch = { isActive: 0, image: 0 };
        const options = {};
        schema.find(conditions, fetch, options, (err, data) => {
            if (err) {
                response.status(500).send(err);
            } else {
                const transformedData = data.map(adhoc => adhoc.toJSON());
                response.json(data);
            }
        })
    })
    .post(async (request, response) => {
        const dataToSave = request.body;
        if (Object.prototype.toString.call(dataToSave) === '[object Array]') {
            if (dataToSave.length) {
                try {
                    const data = await schema.insertMany(dataToSave, { ordered: true })
                    response.json(data);
                } catch (error) {
                    response.status(500).send(error.message);
                }
            } else {
                response.status(400).send("No records found to be saved");
            }
        } else if (Object.prototype.toString.call(dataToSave) === '[object Object]') {
            const category = new schema(dataToSave);
            try {
                const data = await category.save();
                response.json(data);
            } catch (error) {
                response.status(500).send(error);
            }
        } else {
            response.status(400).send("No Records are found to be in proper shape");
        }
    })
    .put(checkIfItemIdAvailable, async (request, response) => {
        const data = request.body;
        const itemId = request.params.itemId;
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const dataToUpdate = {};
            if (data.name) {
                dataToUpdate.name = data.name;
            }
            if (data.description) {
                dataToUpdate.description = data.description;
            }
            if (data.price) {
                dataToUpdate.price = data.price;
            }
            if (data.categoryId) {
                dataToUpdate.categoryId = data.categoryId;
            }
            if (data.image) {
                dataToUpdate.image = data.image;
            }
            if (data.isActive) {
                dataToUpdate.isActive = data.isActive;
            }
            try {
                const updatedData = await schema.findByIdAndUpdate(
                    ObjectId(itemId), { $set: dataToUpdate }, { new: true }
                );
                response.json(updatedData);
            } catch (error) {
                response.status(500).send(error.message);
            }
        } else {
            response.status(400).send("No Records are found to be in proper shape");
        }
    })
    .delete(checkIfItemIdAvailable, async (request, response) => {
        const itemId = request.params.itemId;
        try {
            const deletionStatus = await schema.findByIdAndDelete(ObjectId(itemId));
            response.json(deletionStatus);
        } catch (error) {
            response.status(500).send(error);
        }
    });


function checkIfItemIdAvailable(request, response, next) {
    const itemId = request.params && request.params.itemId;
    if (!itemId) {
        response.status(400).send("No identifier found against the data to update");
    } else {
        next();
    }
}
module.exports = router;
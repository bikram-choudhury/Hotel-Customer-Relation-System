const express = require('express');
const router = express.Router();
const schema = require('../schemas/category.schema');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.route('/:categoryId?')
    .get((request, response) => {
        const conditions = { isActive: true };
        const fetch = { name: 1, image: 1 };
        const options = {};
        schema.find(conditions, fetch, options, (err, data) => {
            if (err) {
                response.status(500).send(err);
            } else {
                const transformedData = data.map(adhoc => adhoc.toJSON());
                response.json(transformedData);
            }
        })
    })
    .post((request, response) => {
        const dataToSave = request.body;
        if (Object.prototype.toString.call(dataToSave) === "[object Array]") {
            if (dataToSave.length) {
                schema.insertMany(dataToSave, { ordered: true }, (err, data) => {
                    if (err) {
                        response.status(500).send(err);
                    } else {
                        response.json(data);
                    }
                })
            } else {
                response.status(400).send("No records found to be saved");
            }
        } else if (Object.prototype.toString.call(dataToSave) === "[object Object]") {
            const category = new schema(dataToSave);
            // https://mongoosejs.com/docs/guide.html#validateBeforeSave
            category.save({ validateBeforeSave: true }, (err, data) => {
                if (err) {
                    response.status(500).send(err);
                } else {
                    response.json(data);
                }
            });
        } else {
            response.status(400).send("No Records are found to be in proper shape");
        }
    })
    .put(checkIfCategoryIdAvailable, async (request, response) => {
        const data = request.body;
        const categoryId = request.params.categoryId;
        if (Object.prototype.toString.call(data) === '[object Object]') {
            const dataToUpdate = {};
            if (data.name) {
                dataToUpdate.name = data.name;
            }
            if (data.isActive) {
                dataToUpdate.isActive = data.isActive;
            }
            try {
                const updatedData = await schema.findByIdAndUpdate(
                    ObjectId(categoryId), { $set: dataToUpdate }, { new: true }
                );
                response.json(updatedData);
            } catch (error) {
                response.status(500).send(error);
            }

        } else {
            response.status(400).send("No Records are found to be in proper shape");
        }
    })
    .delete(checkIfCategoryIdAvailable, async (request, response) => {
        const categoryId = request.params.categoryId;
        try {
            const deletionStatus = await schema.findByIdAndDelete(ObjectId(categoryId));
            response.json(deletionStatus);
        } catch (error) {
            response.status(500).send(error);
        }
    });


function checkIfCategoryIdAvailable(request, response, next) {
    const categoryId = request.params && request.params.categoryId;
    if (!categoryId) {
        response.status(400).send("No identifier found against the data to update");
    } else {
        next();
    }
}

module.exports = router;
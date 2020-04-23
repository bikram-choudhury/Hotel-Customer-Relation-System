const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: [{
        itemId: {
            type: String,
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

Schema.path('items').validate(
    value => value.length > 0,
    "should have some items to save into cart"
)

module.exports = mongoose.model('cart', Schema);
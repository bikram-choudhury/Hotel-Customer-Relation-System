const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    categoryId: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    }
});

Schema.path('name').validate(
    (value) => value.length <= 400,
    "maximum length must be less than or equal to 40."
);
Schema.method('toJSON', function () {
    const { __v, _id, ..._this } = this.toObject();
    _this.id = _id;
    return _this;
});

module.exports = mongoose.model('items', Schema);
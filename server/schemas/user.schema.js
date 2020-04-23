const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isACtive: {
        type: Boolean,
        required: false,
        default: true
    }
});

Schema.path('username').validate(
    (value) => {
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(value);
    },
    "should be a valid mail id"
);

Schema.method('toJSON', function () {
    const { __v, _id, ..._this } = this.toObject();
    _this.id = _id;
    return _this;
});

module.exports = mongoose.model('users', Schema);
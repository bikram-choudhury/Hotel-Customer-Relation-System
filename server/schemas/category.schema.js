const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: false,
        default: true
    }
});

categorySchema.method('toJSON', function () {
    const { __v, _id, ..._this } = this.toObject();
    _this.id = _id;
    return _this;
});

/*  Run bellow command to make "name" unique
 https://stackoverflow.com/questions/22602598/how-to-make-a-variable-a-unique-key-in-mongoose
 db.categories.createIndex( { "name": 1 }, { unique: true } )
*/

module.exports = mongoose.model('categories', categorySchema);
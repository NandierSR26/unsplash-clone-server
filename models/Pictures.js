const { Schema, model } = require('mongoose');

const picturesSchema = Schema({
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    filename: {
        type: String
    },
    mimetype: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
}, {
    timestamps: true
});

module.exports = model('Pictures', picturesSchema);
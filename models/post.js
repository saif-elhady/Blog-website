const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    title: {
        type: String,
        requred: true
    },
    body: {
        type: String,
        requred: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

URL = mongoose.model('Url', urlSchema);
module.exports = URL;
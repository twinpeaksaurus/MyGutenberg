const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        minlength: 2
    },
    published: {
        type: Number,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },
    genres: [
        {
            type: String,
            required: true
        }
    ],
    description: {
        type: String,
        required: true,
        minlength: 5
    }
})

module.exports = mongoose.model('Book', schema)

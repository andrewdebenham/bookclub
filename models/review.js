const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema ({
    text: {
        type: String,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true
    },
    bookTitle: {
        type: String,
        required: true
    },
    bookAuthor: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    rating: {
        type: Number,
        required: true
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
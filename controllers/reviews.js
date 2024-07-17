const express = require('express');
const verifyToken = require('../middleware/verify-token');
const Review = require('../models/review');

const router = express.Router();

// Pubic Routes (none?)

// Protected Routes
router.use(verifyToken);

// Index
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().populate('author');
        res.json(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
});

// Create
router.post('/', async (req, res) => {
    try {
        const review = await Review.create({...req.body, author: req.user._id});
        await review.populate('author');
        res.status(201).json(review);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
});

// Show
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).populate('author');
        res.json(review);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
});

// Get reviews by userId
router.get('/user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const reviews = await Review.find({author: userId}).populate('author');

        if (!reviews) {
            return res.status(404).json({message: 'No reviews found for this user.'});
        }
        res.json(reviews);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message)
    }
});

// Update
router.put('/:id', async (req, res) => {
    try {
        // find the review
        const review = await Review.findById(req.params.id);

        // verify that user is the owner of the review
        if (! review.author.equals(req.user._id)) {
             return res.status(403).json('You are not permitted to modify this review');
        }

        // update review
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('author');

        // issue json response
        res.json(updatedReview);

    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
});

// Delete
router.delete('/:id', async (req, res) => {
    try {
        // get review
        const review = await Review.findById(req.params.id);

        // check ownership
        if (! review.author.equals(req.user._id)) {
            return res.status(403).json('You are not permitted to delete this review');
        }

        // delete
        await review.deleteOne();

        // send back deleted review (why?)
        res.json(review);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});


// comment create 
router.post('/:reviewId/comments', async (req, res) => {
    try {
        const review = await Review.findById(req.params.reviewId);
        review.comments.push({...req.body, author: req.user._id});
        await review.save();

        await review.populate({
            path: 'comments',
            populate: 'author'
        });
        const comment = review.comments.pop();
        
        res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
});

module.exports = router;
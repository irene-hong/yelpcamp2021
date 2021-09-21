
const express = require('express');
const router = express.Router({ mergeParams: true }); // 用于读取url中的campground id
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { campgroundSchema, reviewSchema } = require('../schemas');
const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware');
const reviewsController = require('../controllers/reviews');
/**
 *  Review Route
 */




// CREATE
router.post('/', isLoggedIn, validateReview, catchAsync(reviewsController.createReview));

// DELETE
router.delete('/:rid', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;

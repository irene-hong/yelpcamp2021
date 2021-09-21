const express = require('express');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');


module.exports.isLoggedIn = function (req, res, next) {
    if (!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in.');
        return res.redirect('/login');
    } 
    next();
};

module.exports.isAuthor = async function (req, res, next) {
        let camp = await Campground.findById(req.params.id);
        // console.log(camp);
        // console.log(req.user._id);
        if (!camp){
            req.flash('error', 'Cannot find that campground.');
            return res.redirect('/campgrounds');
        }
        if (!req.user._id.equals(camp.author)){
            req.flash('error', 'You do not have permission to do this.');
            return res.redirect(`/campgrounds/${camp._id}`);
            
        }
        next();
};

module.exports.isReviewAuthor = async function (req, res, next) {
    let { id, rid } = req.params;
    let review = await Review.findById(rid);
    if (!review){
        req.flash('error', 'Cannot find that review.');
        return res.redirect(`/campgrounds/${ id }`);
    }
    if (!req.user._id.equals(review.author)){
        req.flash('error', 'You do not have permission to do this.');
        return res.redirect(`/campgrounds/${ id }`);
    }
    next();
};


module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if (error){
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};





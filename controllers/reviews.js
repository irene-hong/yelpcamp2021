const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
    let id = req.params.id;
    let camp = await Campground.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    camp.reviews.push(review);
    await camp.save();
    // console.log(result);
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, rid } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: rid}});
    await Review.findByIdAndDelete(rid);
    res.redirect(`/campgrounds/${id}`);
};
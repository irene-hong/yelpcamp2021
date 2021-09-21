const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');

const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { campgroundSchema, reviewSchema } = require('../schemas');

const campgroundsControllers = require('../controllers/campgrounds');

const { isLoggedIn, isAuthor } = require('../middleware');

/**
 *  Campground Route
 */

 const validateCampground = (req, res, next) => {
    // console.log(req.body);
    console.log(req.body);
    let { error } = campgroundSchema.validate(req.body);
    console.log('so far so good 2');
    if (error){
        let msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.route('/')
    .get(catchAsync(campgroundsControllers.index))
    .post(isLoggedIn, upload.array("image"), catchAsync(campgroundsControllers.createCampground));

// CREATE
router.get('/new', isLoggedIn, campgroundsControllers.renderNewForm);

// UPDATE
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgroundsControllers.renderEditForm));


// 带参数的url放到最后 否则会把正常url字符识别为id
router.route('/:id')
    .get(catchAsync(campgroundsControllers.showCampground))
    .delete(isAuthor, catchAsync(campgroundsControllers.deleteCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"),validateCampground, catchAsync(campgroundsControllers.updateCampground));


module.exports = router;
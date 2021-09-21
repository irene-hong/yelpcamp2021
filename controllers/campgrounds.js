const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    
    let newCamp = new Campground(req.body.campground);
    newCamp.author = req.user._id;
    newCamp.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    newCamp.geometry = geoData.body.features[0].geometry;
    await newCamp.save();
    console.log(newCamp);
    req.flash('success', 'Successfully made a new campground.');
    res.redirect(`/campgrounds/${newCamp._id}`);
};

module.exports.showCampground = async (req, res) => {
    let camp = await (await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author' // author of the reviews
        }
    })).populate('author');
    if (!camp){
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
};

module.exports.renderEditForm = async (req, res) => {
    let camp = await Campground.findById(req.params.id);
    // console.log(req.params.id);
    // console.log(camp);
    if (!camp){
        req.flash('error', 'Cannot find the campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { camp });
};

module.exports.updateCampground = async (req, res)=> {
    let id = req.params.id;
    let updatedCamp = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {new: true});

    // add new images
    let newImgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    updatedCamp.images.push(...newImgs);
    await updatedCamp.save();

    // delete selected images
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await updatedCamp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    
    req.flash('success', 'Successfully updated this campground.'); 
    res.redirect(`/campgrounds/${ updatedCamp._id }`);
};

module.exports.deleteCampground = async (req, res) => {
    let id = req.params.id;
    await Campground.findByIdAndDelete(id); 
    // will trigger findOneAndDelete => trigger delete reviews
    // see at models/campground.js
    res.redirect('/campgrounds');
};
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

const path = require('path');

const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error: "));
db.once("open", ()=>{
    console.log('Database connected');
})

// sample随机选择array中的一个元素
// 用于seedDB中title的组合
function sample(array){
    let ind = Math.floor(Math.random() * array.length);
    // console.log(ind);
    return array[ind];
}


// 生成50个随机的camp存入数据库
const seedDB = async() => {
    // 先清空已有数据
    await Campground.deleteMany({});

    for (let i = 0; i < 200; i++){
        const random1000 = Math.floor((Math.random() * 1000));
        const price = Math.floor(Math.random() * 20) + 10;
        let camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images:[ 
                { "url" : "https://res.cloudinary.com/drycn0t6i/image/upload/v1631861793/YelpCamp/pcr2o9ohxhspcqtpitiy.jpg", "filename" : "YelpCamp/pcr2o9ohxhspcqtpitiy"}, 
                { "url" : "https://res.cloudinary.com/drycn0t6i/image/upload/v1631861794/YelpCamp/h5gth9l7sa7n4dfj2tky.jpg", "filename" : "YelpCamp/h5gth9l7sa7n4dfj2tky" 
            }],
            price: price,
            author: "6142ae5f7eafc1046c02089a",
            geometry:  { 
                "type" : "Point", 
                "coordinates" : [cities[random1000].longitude, cities[random1000].latitude] 
            }
        });
        await camp.save();
    }
    console.log("Successfully saved 200 camps.")
}

seedDB().then(() => {
    mongoose.connection.close();
})

